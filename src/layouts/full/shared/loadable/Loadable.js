import React, { Suspense } from 'react';

// project imports
import SuspenseLoader from './SuspenseLoader';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
