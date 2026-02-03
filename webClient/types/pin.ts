
//pin Item
export interface PinItem {
  id?: number | string;
  img: string;
  video?: string;
  title: string;
  description?: string;
  link?: string;
  author?: {
    name: string;
    avatar?: string;
    profileUrl?: string;
  };
  saved?: boolean;
  isFavourite?: boolean
  createdByUser?: boolean
  saveCount?: number;

  boardId?: string | number //relationship to board item
}


export interface PinForm {
  id?: number | string;
  img: string;
  video?: string;
  title: string;
  description?: string;
  link?: string;
  board?: string,
   author?: {
    name: string
    avatar?: string
    profileUrl?: string
  },
  saved?: boolean;
  saveCount?: number;
}
