import { iso } from "@iso-bfc";

export const Home = iso(`
  field Query.Home @component {
    __typename
  }
`)(function Home({ data }) {
  return (
    <div 
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1 
        style={{
          fontSize: '3em',
          fontFamily: 'var(--marketingFontFamily)',
          color: 'var(--text)',
          marginBottom: '24px',
          lineHeight: '1.1'
        }}
      >
        Do something with your feedback.
      </h1>
      <p 
        style={{
          fontSize: '1.5em',
          color: 'var(--text)',
          fontFamily: 'var(--fontFamily)',
          opacity: 0.8
        }}
      >
        Coming soon.
      </p>
    </div>
  );
});
