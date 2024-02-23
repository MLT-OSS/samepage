import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { globalRouters } from './router';

import '@/common/styles/frame.less';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={globalRouters} />);
