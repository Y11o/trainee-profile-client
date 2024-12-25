export class ContactModel {
  constructor(json: IContact) {
    this.id = json.id;
    this.user = new UserModel(json.user);
    this.role = json.role;
    this.email = json.email;
    this.phone = json.phone;
    this.phoneLink = json.phoneLink;
    this.telegram = new TelegramModel(json.telegram);
    this.img = new ImgModel(json.img);
  }

  id: number;

  user: UserModel;

  role: string;

  email: string;

  phone: string;

  phoneLink: string;

  telegram: TelegramModel;

  img: ImgModel;
}

export class UserModel {
  constructor(json: IUser) {
    this.name = json.name;
    this.surname = json.surname;
    this.patronymic = json.patronymic;
  }

  name: string;

  surname: string;

  patronymic: string;
}

export class TelegramModel {
  constructor(json: ITelegram) {
    this.nik = json.nik;
    this.ref = json.ref;
  }
    
  nik: string;

  ref: string
}

export class ImgModel {
  constructor(json: IImg) {
    this.src = json.src;
    this.alt = json.alt;
  }

  src: string;

  alt: string;
}