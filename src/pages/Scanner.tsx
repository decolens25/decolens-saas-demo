import React from 'react';
import ScannerContainer from '../components/scanner/ScannerContainer';

const Scanner: React.FC = () => {
  return (
    <div className="container mx-auto pt-16 px-4 py-12">
      <ScannerContainer
        showCloseButton={false}
      />
    </div>
  );
};

export default Scanner;