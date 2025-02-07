import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const products = [
  { id: 1, name: 'Modern Sofa', price: '$599', image: '/sofa.webp' },
  { id: 2, name: 'Dining Table', price: '$399', image: '/dining-table.jpg' },
  { id: 3, name: 'Bedroom Set', price: '$899', image: '/bedroom-set.jpg' },
  { id: 4, name: 'Office Chair', price: '$199', image: '/office-chair.jpg' },
];

export default function Home() {
  return (
    <div className="  bg-gray-100  flex flex-col ">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Hero Section */}
      <div className="bg-white h-full">
        <div className="max-w-7xl mx-auto  py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Welcome to</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Our Furniture Store
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Discover comfort and style with our curated collection of furniture.
            </p>
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Featured Products</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  width={300}
                  height={300}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
