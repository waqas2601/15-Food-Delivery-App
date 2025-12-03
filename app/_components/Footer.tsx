const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Upper Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold tracking-wide">🍽 Foodie App</h2>

          <ul className="flex gap-6 text-sm">
            <li className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Terms
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Support
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-2 pt-2 text-center">
          <p className="text-sm tracking-wide">
            © {new Date().getFullYear()} Foodie App — All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
