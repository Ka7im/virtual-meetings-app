import axios from "axios"

export const saveImage = (img: string, roomId: string) => {
  axios
    .post(`${process.env.NEXT_PUBLIC_PAINT_DOMAIN}/image?id=${roomId}`, {
      img,
    })
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error))
}