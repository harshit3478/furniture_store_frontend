import React from 'react';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;