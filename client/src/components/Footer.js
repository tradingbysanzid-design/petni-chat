import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-purple-500 border-opacity-30 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-purple-400">Petni Chat</h3>
            <p className="text-gray-400 text-sm">Vanish Like a Petni — Stay Anonymous</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Features</a></li>
              <li><a href="#" className="hover:text-purple-400">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-400">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Twitter</a></li>
              <li><a href="#" className="hover:text-purple-400">Instagram</a></li>
              <li><a href="#" className="hover:text-purple-400">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-500 border-opacity-30 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Petni Chat. All rights reserved. Vanish Like a Petni.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
