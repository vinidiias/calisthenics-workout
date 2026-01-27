import { Link } from 'react-router-dom';
// MATERIAL UI
import { Box, useTheme } from '@mui/material';
// ICONS
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    const theme = useTheme();

    return (
      <Box
        component="footer"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          py: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.5, sm: 2.5 },
        }}
      >
        <p>&copy; 2025. All right reserved.</p>
        <Box component="ul" sx={{ display: "flex", alignItems: "center", gap: 1, listStyle: "none", p: 0, m: 0 }}>
          <Box component="li" sx={{ cursor: "pointer", transition: "all 500ms", "&:hover": { transform: "scale(1.1)" } }}>
            <Link
              to="https://www.facebook.com/vinicius.dias.9216778?locale=pt_BR"
              target="_blank"
            >
              <FacebookIcon />
            </Link>
          </Box>
          <Box component="li" sx={{ cursor: "pointer", transition: "all 500ms", "&:hover": { transform: "scale(1.1)" } }}>
            <Link
              to="https://www.linkedin.com/in/vinicius-diass/"
              target="_blank"
            >
              <LinkedInIcon />
            </Link>
          </Box>
          <Box component="li" sx={{ cursor: "pointer", transition: "all 500ms", "&:hover": { transform: "scale(1.1)" } }}>
            <Link
              to="https://www.instagram.com/viniciusdiias_/"
              target="_blank"
            >
              <InstagramIcon />
            </Link>
          </Box>
        </Box>
      </Box>
    );
}

export default Footer