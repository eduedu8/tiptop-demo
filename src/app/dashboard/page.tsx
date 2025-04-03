"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading Dashboard...</p>;
  if (!session) {
    signIn();
    return null;
  }

  // Dummy data for Overview Section
  const totalEarnings = "$1,200.00";
  const activeAssets = 4;
  const pendingActionsCount = 2;
  const todaysRevenue = "$150.00";

  // Dummy Assets data
  const dummyAssets = [
    { id: 1, type: "Rooftop", status: "Active", revenue: "$100/mo", partner: "Neighbor.com" },
    { id: 2, type: "Bandwidth", status: "Active", revenue: "$120/mo", partner: "Grass" },
    { id: 3, type: "Parking", status: "Pending", revenue: "$80/mo", partner: "SpotHero" },
    { id: 4, type: "Garden", status: "Inactive", revenue: "$50/mo", partner: "GreenScape" },
  ];

  // Dummy pending actions mapping
  const pendingActionMapping: { [key: string]: string } = {
    Rooftop: "Sign Contract",
    Bandwidth: "Download App",
    Parking: "Define Hours",
    Garden: "N/A",
    Pool: "N/A",
    Storage: "N/A",
    Car: "Upload Picture",
    Item: "N/A",
  };

  // Dummy earnings data for the Earnings Section
  const dummyEarnings = [
    { id: 1, asset: "Rooftop", revenue: "$100/mo", date: "2025-04-01" },
    { id: 2, asset: "Bandwidth", revenue: "$120/mo", date: "2025-04-02" },
    { id: 3, asset: "Parking", revenue: "$80/mo", date: "2025-04-03" },
    { id: 4, asset: "Garden", revenue: "$50/mo", date: "2025-04-04" },
  ];

  // Helper function to get the status dot color
  const getStatusDotColor = (status: string) => {
    if (status.toLowerCase() === "active") return "bg-green-500";
    if (status.toLowerCase() === "pending") return "bg-yellow-500";
    if (status.toLowerCase() === "inactive") return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "#FFFDED",
        color: "#552B1B",
        fontFamily: '"Work Sans", sans-serif',
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1
          className="text-3xl"
          style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}
        >
          Dashboard
        </h1>
        <Link href="/">
          <button
            className="bg-[#AA94E2] text-white px-4 py-2 rounded"
            style={{ fontFamily: '"Fahkwang", sans-serif' }}
          >
            tiptop Home
          </button>
        </Link>
      </header>

      {/* Overview Section */}
      <section className="mb-10">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}
        >
          Hello, {session.user?.name}!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white shadow rounded flex flex-col items-center">
            <div className="text-2xl font-bold">{totalEarnings}</div>
            <div className="text-sm">Total Earnings</div>
          </div>
          <div className="p-4 bg-white shadow rounded flex flex-col items-center">
            <div className="text-2xl font-bold">{activeAssets}</div>
            <div className="text-sm">Active Assets</div>
          </div>
          <div className="p-4 bg-white shadow rounded flex flex-col items-center">
            <div className="text-2xl font-bold">{pendingActionsCount}</div>
            <div className="text-sm">Pending Actions</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Assets Distribution Pie Chart Card (using different purple tones) */}
          <div
            className="bg-white p-4 rounded shadow flex flex-col items-center justify-center"
            style={{ width: "200px", height: "200px" }}
          >
            <p className="text-gray-500 text-sm mb-2">Assets Distribution</p>
            <svg width="100" height="100" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#AA94E2" />
              <path d="M16 16 L16 0 A16 16 0 0 1 29 12 z" fill="#9A7ABF" />
              <path d="M16 16 L29 12 A16 16 0 0 1 22 32 z" fill="#8A68B3" />
              <path d="M16 16 L22 32 A16 16 0 0 1 9 22 z" fill="#7A55A7" />
              <path d="M16 16 L9 22 A16 16 0 0 1 16 0 z" fill="#6A43A1" />
            </svg>
          </div>
          {/* Today's Revenue Card */}
          <div
            className="bg-white p-4 rounded shadow flex flex-col items-center justify-center"
            style={{ width: "200px", height: "200px" }}
          >
            <p className="text-gray-500 text-sm">Today's Revenue</p>
            <div className="text-3xl font-bold">{todaysRevenue}</div>
          </div>
          {/* Revenue Over Time Chart Card (narrower) */}
          <div
            className="bg-white p-4 rounded shadow flex flex-col justify-center"
            style={{ flex: 1, height: "200px" }}
          >
            <p className="text-center text-gray-500 text-sm mb-1">Revenue Over Time</p>
            <svg width="100%" height="150" viewBox="0 0 400 150">
              {/* Y-axis labels */}
              <text x="0" y="20" fontSize="10" fill="gray">$150</text>
              <text x="0" y="50" fontSize="10" fill="gray">$100</text>
              <text x="0" y="80" fontSize="10" fill="gray">$50</text>
              <text x="0" y="110" fontSize="10" fill="gray">$0</text>
              {/* Line graph path */}
              <path
                d="M40,110 L80,80 L120,90 L160,40 L200,50 L240,20 L280,40 L320,10 L360,20"
                stroke="#AA94E2"
                strokeWidth="3"
                fill="none"
              />
              {/* X-axis month labels */}
              <text x="40" y="140" fontSize="10" fill="gray">Jan</text>
              <text x="80" y="140" fontSize="10" fill="gray">Feb</text>
              <text x="120" y="140" fontSize="10" fill="gray">Mar</text>
              <text x="160" y="140" fontSize="10" fill="gray">Apr</text>
              <text x="200" y="140" fontSize="10" fill="gray">May</text>
              <text x="240" y="140" fontSize="10" fill="gray">Jun</text>
              <text x="280" y="140" fontSize="10" fill="gray">Jul</text>
              <text x="320" y="140" fontSize="10" fill="gray">Aug</text>
              <text x="360" y="140" fontSize="10" fill="gray">Sep</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Assets Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}
          >
            Your Assets
          </h2>
          <Link href="/">
            <button
              className="bg-[#AA94E2] text-white px-4 py-2 rounded"
              style={{ fontFamily: '"Fahkwang", sans-serif' }}
            >
              Add New Asset
            </button>
          </Link>
        </div>
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Asset Type</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Revenue</th>
              <th className="py-2 px-4 text-left">Monetization Partner</th>
              <th className="py-2 px-4 text-left">Actions</th>
              <th className="py-2 px-4 text-left">Manage</th>
            </tr>
          </thead>
          <tbody>
            {dummyAssets.map((asset) => (
              <tr key={asset.id} className="border-b">
                <td className="py-2 px-4">{asset.type}</td>
                <td className="py-2 px-4 flex items-center">
                  <span
                    className={`w-3 h-3 mr-2 rounded-full ${getStatusDotColor(
                      asset.status
                    )}`}
                  ></span>
                  {asset.status}
                </td>
                <td className="py-2 px-4">{asset.revenue}</td>
                <td className="py-2 px-4">{asset.partner}</td>
                {/* Pending Actions Column */}
                <td className="py-2 px-4">
                  {pendingActionMapping[asset.type] === "N/A" ? (
                    "N/A"
                  ) : (
                    <button className="text-blue-500 hover:underline">
                      {pendingActionMapping[asset.type]}
                    </button>
                  )}
                </td>
                {/* Manage Column */}
                <td className="py-2 px-4 space-x-2">
                  <button className="text-[#AA94E2] hover:underline">Edit</button>
                  <button className="text-[#AA94E2] hover:underline">View Details</button>
                  <button className="text-red-500 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Earnings Section */}
      <section className="mb-10">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}
        >
          Earnings
        </h2>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input type="date" className="border p-2 rounded" />
          <select className="border p-2 rounded">
            <option>All Asset Types</option>
            <option>Rooftop</option>
            <option>Bandwidth</option>
            <option>Parking</option>
            <option>Garden</option>
          </select>
          <select className="border p-2 rounded">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Earnings Table */}
          <div className="w-full sm:w-2/3">
            <table className="min-w-full bg-white rounded shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Asset Type</th>
                  <th className="py-2 px-4 text-left">Revenue</th>
                  <th className="py-2 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyEarnings.map((entry) => (
                  <tr key={entry.id} className="border-b">
                    <td className="py-2 px-4">{entry.asset}</td>
                    <td className="py-2 px-4">{entry.revenue}</td>
                    <td className="py-2 px-4">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-sm text-gray-600">Page 1 of 1</div>
          </div>
          {/* Earnings Chart Card */}
          <div className="w-full sm:w-1/3 bg-white p-4 rounded shadow flex items-center justify-center">
            <p className="text-center text-gray-500">Earnings Chart (simulated)</p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="mb-10">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}
        >
          Profile
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">User Information</h3>
          <p>Name: {session.user?.name}</p>
          <p>Email: {session.user?.email}</p>
          <button className="mt-2 bg-[#AA94E2] text-white px-3 py-1 rounded">
            Change Password
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Connected Accounts</h3>
          <ul className="list-disc ml-6">
            <li>Swimply</li>
            <li>SpotHero</li>
            <li>Neighbor.com</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Notifications & Settings</h3>
          <p>Notification settings and account preferences go here.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
