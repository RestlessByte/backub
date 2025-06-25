// import { NextApiRequest, NextApiResponse } from 'next';
// import { decryptedDataClient, encryptedDataClient } from '@main/crypto/client';
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { data } = req.body
//   const decryptedData = await decryptedDataClient(data, DecryptedKeys)
//   const { ai } = decryptedData
//   const { user_prompt, chat_id } = ai
//   const system_prompt = "Привет! Ты гений в области AI интеграции. Ты встроен в веб браузер данного пользователя!  Ты Senior Developer с 20+ стажем разработки, пишешь любой код без каких либо ошибок!"
//   const response = await usingMistral(user_prompt, system_prompt)
//   const encryptData = await encryptedDataClient({
//     res: response,
//     req: user_prompt
//   }, DecryptedKeys)
//   res.status(200).json({ data: encryptData })
// }