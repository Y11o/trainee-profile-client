import { markRaw, onBeforeUnmount, watch } from 'vue';
import { defineStore } from 'pinia';
import type { Component, ComponentPropsOptions, MaybeRef, PublicProps, Ref } from 'vue';

type EmitHandler = (...args: any[]) => any;

/**
 * @type {symbol} уникальный идентификатор вызова метода {@link useEmits}
 * @type {EmitHandler} обработчик данного события
 */
type EmitHandlersEnum = Map<symbol, EmitHandler>

/**
 * @type {string} namespace события компонента (названиe)
 * @type {EmitHandlersEnum} хранится {@link Map}, каждый Map - зарегистрированная обработка
 * события в конкретном компоненте
 */
type ComponentEmitsHandlers = Record<string, EmitHandlersEnum>;

/**
 * @type {ComponentName} название события текущего вмонтированного компонента
 * @type {Record<string, EmitHandler>} название и обработчик данного события
 */
type ComponentsPublicEmitsOptions = Partial<Record<
  ComponentName,
  Record<string, EmitHandler>
>>;

/**
 * Извлечение типа пропсов переданного компонента {@link FunctionalComponent},
 */
type ComponentProps<TComponent> = TComponent extends new () => {
  $props: infer TProps;
} ? Omit<TProps, keyof PublicProps> : never;

/**
 * Выведение типа для передачи инстанса компонента и пропсов
 */
type DrawerComponentOptions<TComponent> = {
  [componentName: ComponentName]: Component;
  /**
   * Если в компоненте объявлены пропсы {@link defineProps}, props принимает тип Required<TProps>
   * Extends {@link ComponentPropsOptions} используется для случая, если заданы пропсы по умолчанию
   */
} & (ComponentProps<TComponent> extends ComponentPropsOptions ? {
  props?: Record<string, never>
} : {
  props: {
    /**
     * Если пропс типа T обернут в Ref - тип расширяется на Ref<T> и T
     * (для передачи как ref-ссылки и значения ref-ссылки, т.к. по умолчанию
     * тип реактивных пропсов {@link Ref} разворачивается в тип значения)
     */
    [TProps in keyof ComponentProps<TComponent>]:
    ComponentProps<TComponent>[TProps] extends MaybeRef<infer TProp>
      ? (TProp | Ref<TProp>)
      : never
  }
})

type ComponentName = string;

interface ComponentInstance {
  name: ComponentName | null;
  instance: Component | null;
}

interface ComponentData {
  component: ComponentInstance;
  props?: Record<string, unknown>;
}

/**
 * Хранение обработчиков конкретного события в виде массива, собранных со всех вызовов {@link useEmits}
 */
type ComponentEmits = Record<string, EmitHandler[]>;

interface State {
  isOpen: boolean;
  registeredEmits: Map<ComponentName, ComponentEmitsHandlers>;
  componentEmits: ComponentEmits;
  componentData: ComponentData;
}

const initialComponentData: ComponentData = {
  component: { name: null, instance: null },
  props: {},
};

export const useDrawerStore = defineStore('drawerStore', {
  state: (): State => ({
    isOpen: false,

    /**
     * Все обработчики событий компонентов, зарегистрированные с помощью {@link useEmits}
     */
    registeredEmits: new Map(),

    /**
     * Обработчики событий текущего вмонтированного компонента, извлеченные из {@link registeredEmits}
     */
    componentEmits: {},

    /**
     * Название и инстанс компонента
     */
    componentData: { ...initialComponentData },
  }),
  actions: {
    /**
     * @param drawerComponent передавать как инстанс компонента или defineAsyncComponent
     * @param drawerComponent.props prop передавать как ref-ссылку:
     * const { prop } = toRefs(props); (не-реактивные пропсы (константы) передаются обычным способом)
     */
    open<T>(drawerComponent: DrawerComponentOptions<T>) {
      const { props = {}, ...component } = drawerComponent;

      if (!Object.keys(component).length) {
        return;
      }

      const [name, instance] = (Object.entries(component))[0];
      
      this.isOpen = true;

      Object.assign(this.componentData, {
        props,
        component: {
          name,
          instance: markRaw(instance),
        },
      });
    },
    close() {
      this.isOpen = false;
      this.componentEmits = {};
      Object.assign(this.componentData, initialComponentData);
    },

    /**
     * Метод обработки событий компонентов, использующихся в navigation-drawer
     * @type {ComponentName} название компонента
     * @type {Record<string, EmitHandler>} ключ - название события текущего компонента, значение - обработчик
     */
    useEmits(componentsEmits: ComponentsPublicEmitsOptions) {
      const uniqCallId = Symbol();

      Object.entries(componentsEmits).forEach((item) => {
        const [componentName, componentEmitHandlers] = item;

        if (componentEmitHandlers) {
          Object.entries(componentEmitHandlers).forEach((item) => {
            const [emitName, emitHandler] = item;

            const registeredEmit = this.registeredEmits.get(componentName)?.[emitName];

            const handlersEnum: EmitHandlersEnum = new Map();

            handlersEnum.set(uniqCallId, emitHandler);

            if (!registeredEmit) {
              this.registeredEmits.set(componentName, {
                ...this.registeredEmits.get(componentName),
                [emitName]: handlersEnum,
              });
            } else {
              this.registeredEmits.set(componentName, {
                ...this.registeredEmits.get(componentName),
                [emitName]: new Map([...registeredEmit, ...handlersEnum]),
              });
            }
          });
        }
      });

      onBeforeUnmount(() => this.registeredEmits.forEach((componentEmitHandlers) => {
        Object.values(componentEmitHandlers).forEach((emitHanders) => {
          if (emitHanders.has(uniqCallId)) {
            emitHanders.delete(uniqCallId);
          }
        });
      }));

      watch(() => this.componentData.component, () => {
        if (this.componentData.component.instance && this.componentData.component.name) {
          const registeredEmits = this.registeredEmits.get(this.componentData.component.name) || {};

          this.componentEmits = Object.entries(registeredEmits).reduce((acc, [emit, handlers]) => {
            acc[emit] = Array.from(handlers.values()).flat();
            return acc;
          }, { ...this.componentEmits });
        }
      });
    },
  },
});
