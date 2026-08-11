import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center py-32">
    <h1 className="font-display font-extrabold text-6xl text-navy mb-2">404</h1>
    <p className="text-slate-500 mb-6">This page drifted off our radar.</p>
    <Link to="/" className="bg-mustard text-navy font-semibold px-6 py-2.5 rounded-full hover:bg-mustard-light transition-colors">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
