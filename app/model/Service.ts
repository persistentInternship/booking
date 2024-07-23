import { ObjectId } from 'mongodb';

export interface Service {
  _id?: ObjectId;
  name: string;
  category: string;
  price: number;
  duration: string;
  photo: string;
  rating: number;
  description: string;
}