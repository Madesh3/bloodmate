import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About BloodMate</h3>
            <p className="text-gray-600">Connecting blood donors with those in need, making a difference one donation at a time.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/directory" className="block text-gray-600 hover:text-gray-900">Directory</Link>
              <Link to="/become-donor" className="block text-gray-600 hover:text-gray-900">Become a Donor</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-gray-600">Email: support@bloodmate.com</p>
            <p className="text-gray-600">Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} BloodMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;