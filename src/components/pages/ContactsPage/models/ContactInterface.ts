interface IContact {
  id: number,
  user: IUser,
  role: string,
  email: string,
  phone: string,
  phoneLink: string,
  telegram: ITelegram,
  img: IImg
}

interface IUser {
  name: string,
  surname: string,
  patronymic: string
}

interface ITelegram {
  nik: string,
  ref: string
}

interface IImg {
  src: string,
  alt: string
}