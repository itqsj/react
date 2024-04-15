import React, { Suspense, ReactNode, useEffect } from 'react';
import { Route, Navigate, Routes, useNavigate, useLocation } from 'react-router-dom';

import Loading from '@/components/loading/Loading';
const lazyLoad = (children: ReactNode): ReactNode => {
    return <Suspense fallback={<Loading></Loading>}>{children}</Suspense>;
};
const Demo = React.lazy(() => import('@/components/demo/Index'));
const NotFount = React.lazy(() => import('@/views/notFount'));

function IndexRouter() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
    useEffect(() => {
    if (pathname === '/') {
      navigate('/demo/threejs');
    }
  }, []);
  return (
    <Routes>
        <Route path="/demo" element={<Demo></Demo>}></Route>
        <Route path="*" element={lazyLoad(<NotFount></NotFount>)}></Route>
    </Routes>
  );
}

export default IndexRouter;
