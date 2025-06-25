import { decryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";
export default async function handler(data: any) {
    try {
        const decrypt = await decryptedDataClient(data, DecryptedKeys);
        const { basket, id } = decrypt;
        await database('web', 'UPDATE users SET basket = $2 WHERE id = $1', [id, [basket]]);
        return { message: 'Basket updated successfully' };
    } catch (err) {
        console.error(err);
        1
    }

}