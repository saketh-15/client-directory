import { connectToDB } from '../../utils/db';
import Client from '../../models/Clients';

export default async function handler(req: any, res: any) {
  await connectToDB();

  if (req.method === 'GET') {
    const { name = '', type = '', birthday = '' } = req.query;
    console.log(birthday);
    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (type && type !== 'All') filters.type = type;
    if (birthday) {
      filters.birthday = birthday;
    }
    console.log("birthday", birthday);
    const clients = await Client.find(filters).lean();
    res.status(200).json(clients);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
