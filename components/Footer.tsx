export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white mt-12  ">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-gray-300">About Us</a></li>
                <li><a href="/blog" className="hover:text-gray-300">Blog</a></li>
                <li><a href="/careers" className="hover:text-gray-300">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
                <li><a href="/shipping" className="hover:text-gray-300">Shipping Policy</a></li>
                <li><a href="/returns" className="hover:text-gray-300">Returns & Exchanges</a></li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-gray-300">Terms of Service</a></li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">Facebook</a>
                <a href="#" className="hover:text-gray-300">Instagram</a>
                <a href="#" className="hover:text-gray-300">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} Furniture Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  