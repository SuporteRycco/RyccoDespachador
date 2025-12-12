import React, { useEffect, useState } from 'react';

function ImagemAnimada() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisivel(true), 100);
  }, []);

  return (
    <div
      className={`lg:z-20 lg:absolute lg:left-[250px] lg:top-[210px] lg:h-[142px] lg:w-[374px] lg:bg-[url('/BRANCO.png')] bg-cover transition-all duration-1900 ease-out
         md:z-20 md:absolute md:left-[140px] md:top-[180px] md:h-[142px] md:w-[374px] md:bg-[url('/BRANCO.png')] md:bg-cover md:transition-all md:duration-1900 ease-out${
        visivel ? 'top-[208px] opacity-100' : 'top-0 opacity-0'
      }`}
    />
  );
}

export default ImagemAnimada;

