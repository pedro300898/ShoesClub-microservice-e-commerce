import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const ShoeShow = ({ shoe }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      shoeId: shoe.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{shoe.title}</h1>
      <h4>Price: {shoe.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

ShoeShow.getInitialProps = async (context, client) => {
  const { shoeId } = context.query;
  const { data } = await client.get(`/api/shoes/${shoeId}`);

  return { shoe: data };
};

export default ShoeShow;
