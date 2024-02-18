import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SharedLayout from './components/SharedLayout';
import SharedDashboard from './components/Dashboard/SharedDashboard';
import Dashboard from './components/Dashboard/Dashboard';
import Index from './components/Index';
import Recieve from './components/Recieve';
import Send from './components/Send';
import Profile from './components/Profile';
import TokenInfo from './components/TokenInfo';
import Launch from './components/Launch/Launch';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<SharedDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="recieve" element={<Recieve />} />
            <Route path="send" element={<Send />} />
            {/* <Route path="buy" element={<Buy />} /> */}
            <Route path="profile" element={<Profile />} />
            <Route path=":token" element={<TokenInfo />} />
            <Route path="launch" element={<Launch />} />
            {/* <Route path="nfts" element={<NftPage />} /> */}
            {/* <Route path="launch/token" element={<NewToken />} /> */}
            {/* <Route path="launch/nft" element={<NewNfts />} /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
