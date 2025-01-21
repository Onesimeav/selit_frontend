export interface CreateProduct {
  name: string,
  description:string,
  price: number,
  images: File[],
  videos?: File[],
  specification: string[],
}
