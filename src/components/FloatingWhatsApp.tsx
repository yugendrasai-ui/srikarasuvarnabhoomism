// Floating WhatsApp button component

const FloatingWhatsApp = () => {
  const defaultNumber = "+919948720849";
  const displayNumber = "99487 20849"; // Display format

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Number Badge */}
      <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 hidden sm:flex items-center text-sm font-bold text-gray-800 animate-pulse">
        Need help? Call: <span className="text-[#25D366] ml-1">{displayNumber}</span>
      </div>
      
      {/* WhatsApp Button with Ripple Effect */}
      <div className="relative flex items-center justify-center">
        {/* Ripple Rings */}
        <div className="absolute w-full h-full bg-[#25D366] rounded-full animate-ping opacity-75"></div>
        <div className="absolute w-[120%] h-[120%] border-2 border-[#25D366] rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 animation-delay-500"></div>
        <div className="absolute w-[140%] h-[140%] border border-[#25D366] rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-25 animation-delay-1000"></div>
        
        {/* Main Button */}
        <a 
          href={`https://wa.me/${defaultNumber.replace(/[^0-9]/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20b858] hover:scale-110 transition-all duration-300 z-10"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM20.056 3.92C17.911 1.776 15.056.592 12.028.592 5.753.592.651 5.694.649 11.969c-.001 2.003.524 3.96 1.523 5.688L0 24l6.505-1.705c1.666.908 3.565 1.385 5.518 1.385h.004c6.273 0 11.374-5.102 11.376-11.378.001-3.041-1.183-5.901-3.347-8.382z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FloatingWhatsApp;
