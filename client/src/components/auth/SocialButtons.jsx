import React from "react";

function SocialButtons() {
  const handleSocialClick = (provider) => {
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <button
        type="button"
        onClick={() => handleSocialClick("Google")}
        className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#141424] border border-[#252538] hover:border-[#8b5cf6] transition-all rounded-full text-sm font-medium text-[#e8e8f0] cursor-pointer shadow-md"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.127 15.427 1 12.24 1 6.012 1 1 5.967 1 12s5.012 11 11.24 11c6.5 0 10.82-4.51 10.82-11 0-.74-.08-1.305-.18-1.715H12.24z" />
        </svg>
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialClick("GitHub")}
        className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#141424] border border-[#252538] hover:border-[#8b5cf6] transition-all rounded-full text-sm font-medium text-[#e8e8f0] cursor-pointer shadow-md"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
        </svg>
        <span>GitHub</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialClick("LinkedIn")}
        className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#141424] border border-[#252538] hover:border-[#8b5cf6] transition-all rounded-full text-sm font-medium text-[#e8e8f0] cursor-pointer shadow-md"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span>LinkedIn</span>
      </button>
    </div>
  );
}

export default SocialButtons;
