import { Navigate, RouteObject } from 'react-router-dom';

import Messenger from './components/messenger';
import ChatView from './components/messenger/chatView';
import ChatViewPlaceholder from './components/messenger/chatViewPlaceholder';

const routes: RouteObject[] = [
  {
    path: '/*',
    element: <Navigate to="/messenger" replace />,
  },
  {
    path: '/messenger',
    element: <Messenger />,
    children: [
      {
        index: true,
        element: <ChatViewPlaceholder />,
      },
      {
        path: 'chat/:chatId',
        element: <ChatView />,
      },
    ],
  },
];

export default routes;
