import { connectToDB } from '../../utils/db';
import Client from '../../models/Clients';
function convertToDDMMYYYY(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}
export default async function handler(req: any, res: any) {
  await connectToDB();

  if (req.method === 'GET') {
    const { name = '', type = '', birthday = '' } = req.query;

    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (type && type !== 'All') filters.type = type;
    if (birthday) {
      filters.birthday = convertToDDMMYYYY(String(birthday).trim());
    }
    console.log("birthday", birthday);
    const clients = await Client.find(filters).lean();
    res.status(200).json(clients);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
