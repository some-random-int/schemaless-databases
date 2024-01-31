import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Toolbar as PrimeToolbar } from 'primereact/toolbar';
import { useParams } from 'react-router-dom';

type DataParams = {
  supplier_key: string;
};

const Toolbar: FC = () => {
  const { t } = useTranslation();
  const { supplier_key } = useParams<DataParams>();
  
  const toolbarStart = (
    <div className="toolbar-start">
      <h1>Analysis-Platform</h1>
      <div>
        <a href={'/home/' + supplier_key} rel="noopener noreferrer" className="p-button p-button-text p-button-lg">Home</a>
      </div>
      <div>
        <a href={'/data/' + supplier_key} rel="noopener noreferrer" className="p-button p-button-text p-button-lg">Data</a>
      </div>
    </div>
  );
  
  return (
    supplier_key !== undefined ? 
    <PrimeToolbar start={toolbarStart} end={<a href="/" rel="noopener noreferrer" className="p-button">{t('log_out')}</a>}></PrimeToolbar>
    : <PrimeToolbar start={<h1>Analysis-Platform</h1>} />
  );
};

export default Toolbar;

