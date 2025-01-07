/* eslint-disable react/react-in-jsx-scope */
import Typography from '@mui/material/Typography';

function Footer() {
  return (
    <Typography
      style={{
        margin: 0,
        padding: '0px',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
      variant="caption"
      display="block"
      gutterBottom
      sx={{
        textAlign: 'center',
      }}
    >
      ©F18BGAGR
    </Typography>
  );
}

export default Footer;
