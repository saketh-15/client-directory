import { GetServerSideProps } from 'next';
import { connectToDB } from '../utils/db';
import Client from '../models/Clients';
import { useState } from 'react';
import Head from 'next/head';

export default function Home({ initialClients }: any) {
  const [clients, setClients] = useState(initialClients);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [birthday, setBirthday] = useState('');

  async function handleSearch() {
    const res = await fetch(
      `/api/clients?name=${encodeURIComponent(name)}&type=${encodeURIComponent(
        type
      )}&birthday=${encodeURIComponent(birthday)}`
    );
    const data = await res.json();
    setClients(data);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    
    // Add slashes as the user types
    if (value.length > 0) {
      // Format as MM/DD/YYYY
      if (value.length <= 2) {
        // Just the month
        value = value;
      } else if (value.length <= 4) {
        // Month and partial day
        value = value.slice(0, 2) + '/' + value.slice(2);
      } else {
        // Complete date
        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
      }
    }
    
    setBirthday(value);
  }
  return (
   <>
      <Head>
        <title>Client Directory</title>
      </Head>
      <main className="min-h-screen bg-white p-6 flex justify-center items-start">
        <div className="w-full max-w-7xl space-y-8">
          {/* Filter Section */}
          
          <div className="bg-white border border-[#E0D6C0] rounded-[10px] shadow-[0_5px_15px_0_rgba(0,0,0,0.2)] px-8 py-6">

            <div className="flex justify-between items-start">
              <div className="space-y-4 w-full">
                <h2 className="text-2xl font-semibold text-red-900">Client Directory</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-7 "> {/* Changed to mt-16 for more top spacing */}
                  <div>
                    <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Name"
                      className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-800 w-80 w-[300px]" /* Fixed width to w-80 and increased padding */
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="birthday" className="block mb-1 font-medium text-gray-700">Birthday</label>
                    <input
                      id="birthday"
                      type="text"
                      placeholder="MM/DD/YYYY"
                      className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-800 w-full" /* Increased padding */
                      value={birthday}
        onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block mb-1 font-medium text-gray-700">Account Type</label>
                    <select
                      id="type"
                      className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-800 w-full" /* Increased padding */
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    
                    <button
                      className="bg-red-900 rounded-md px-4 py-3 hover:bg-red-800 h-[42px] flex items-center justify-center"
                      onClick={handleSearch}
                    >
                      <img src="/search-icon.png" alt="Search" className="w-5 h-5" />
                    </button>

                   
                    <div className="flex items-center text-sm font-medium ml-[100px]">
                      <button className="mx-2">
                        <img src="/notification-icon.png" alt="Notifications" className="w-6 h-6" />
                      </button>
                      <button className="mx-2">
                        <img src="/settings-icon.png" alt="Settings" className="w-6 h-6" />
                      </button>
                      <img
                        src="/profile-pic.jpg"
                        alt="Profile"
                        className="w-11 h-11 rounded-full object-cover border-2 border-gray-300 ml-4"
                      />
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-[0_5px_15px_rgba(0,0,0,0.2)] rounded-[10px] overflow-x-auto border border-[#E0D6C0]">
            <table className="min-w-full text-sm text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-red-900 text-white">
                  <th className="border-b border-[#E0D6C0] px-6 py-4 text-base font-semibold text-left rounded-tl-[10px]">Name</th>
                  <th className="border-b border-[#E0D6C0] px-6 py-4 text-base font-semibold text-left">Birthday</th>
                  <th className="border-b border-[#E0D6C0] px-6 py-4 text-base font-semibold text-left">Type</th>
                  <th className="border-b border-[#E0D6C0] px-6 py-4 text-base font-semibold text-left">Account</th>
                  <th className="border-b border-[#E0D6C0] px-6 py-4 text-base font-semibold text-left">Balance</th>
                  <th className="border-b border-[#E0D6C0] px-6 py-4 text-base font-semibold text-left rounded-tr-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {clients.map((client: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 border-t border-[#E0D6C0]">
                    <td className="px-6 py-4 border-b border-[#E0D6C0]">{client.name}</td>
                    <td className="px-6 py-4 border-b border-[#E0D6C0]">{client.birthday}</td>
                    <td className="px-6 py-4 border-b border-[#E0D6C0]">{client.type}</td>
                    <td className="px-6 py-4 border-b border-[#E0D6C0]">{client.account}</td>
                    <td className="px-6 py-4 font-bold border-b border-[#E0D6C0]">${client.balance.toFixed(2)}</td>
                    <td className="px-6 py-4 border-b border-[#E0D6C0] space-x-2 text-sm">
                      <button className="text-red-700 hover:underline hover:text-blue-500">Details</button>
                      <span className="text-red-700">|</span>
                      <button className="text-red-700 hover:underline hover:text-blue-500">Transfer</button>
                      <span className="text-red-700">|</span>
                      <button className="text-red-700 hover:underline hover:text-blue-500">Close Account</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </>

  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  await connectToDB();

  const { name = '', type = '', birthday = '' } = context.query;

  const filters: any = {};
  if (name) filters.name = { $regex: new RegExp(name as string, 'i') };
  if (type) filters.type = type;
  if (birthday) filters.birthday = birthday;

  const clients = await Client.find(filters).lean();

  return {
    props: {
      initialClients: clients.map((client: any) => ({
        ...client,
        _id: client._id.toString(),
      })),
    },
  };
};

