import { useState, FC, useEffect, ChangeEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Suppliers from '../APIs/suppliers';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Toolbar from '../components/Toolbar';
import { SupplierApi } from '../APIs/supplier-generated';

const Login: FC = () => {
  const [username, setUsername] = useState<string>('');
  // const [suppliers, setSuppliers] = useState<Suppliers>();
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const supplierAPI = new SupplierApi();

  useEffect(() => {
    // setSuppliers(Suppliers.getInstance());
  }, []);

  const handleLogin = () => {
    // suppliers
    //   ?.getSupplier(username)
    //   .then((supplier) => {
    //     console.log(supplier)
    //     console.log(`Login with username ${username}`);
    //     navigate(`/home/${username}`);
    //   })
    //   .catch(() => {
    //     setShowError(true);
    //   });
    supplierAPI.supplierSupplierIDGet(username)
      .then((supplier) => {
        console.log(supplier)
        console.log(`Login with username ${username}`);
        navigate(`/home/${username}`);
      })
      .catch(() => {
        setShowError(true);
      });
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setShowError(false);
    setUsername(e.target.value);
  };

  return (
    <div>
      <Toolbar></Toolbar>
      <Card title={t('log_in')} footer={<Button slot='end' label={t('log_in')} onClick={handleLogin}></Button>} className="login-card">
        <InputText placeholder={t('enter_supplierId')} value={username} onChange={onInputChange} name='username'/>
        <p className="error" hidden={!showError}>
          {t('unknown_id')}
        </p>
      </Card>
    </div>
  );
  
};

export default Login;
