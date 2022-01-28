import Link from 'next/link';

const LandingPage = ({ currentUser, shoes }) => {
  const shoeList = shoes.map((shoe) => {
    return (
      <tr key={shoe.id}>
        <td>{shoe.title}</td>
        <td>{shoe.price}</td>
        <td>
          <Link href="/shoes/[shoeId]" as={`/shoes/${shoe.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Shoes</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{shoeList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/shoes');

  return { shoes: data };
};

export default LandingPage;
