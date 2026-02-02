import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Grid,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  MenuBook as MenuBookIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const CivicEducation = () => {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState('transparency');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const educationSections = [
    {
      id: 'transparency',
      titleEn: 'Why Tax Transparency Matters',
      titleSw: 'Kwa Nini Uwazi wa Kodi ni Muhimu',
      icon: <VisibilityIcon />,
      content: {
        en: {
          intro: 'Tax transparency is fundamental to good governance and democratic accountability.',
          points: [
            'Enables citizens to understand how their tax contributions are being used',
            'Promotes accountability in government spending and revenue collection',
            'Builds trust between taxpayers and tax authorities',
            'Helps identify areas for improvement in tax policy and administration',
            'Supports evidence-based policy making and public debate'
          ]
        },
        sw: {
          intro: 'Uwazi wa kodi ni msingi wa utawala bora na uwajibikaji wa kidemokrasia.',
          points: [
            'Huwawezesha raia kuelewa jinsi michango yao ya kodi inavyotumika',
            'Hukuza uwajibikaji katika matumizi ya serikali na ukusanyaji wa mapato',
            'Hujenga imani kati ya walipakodi na mamlaka za kodi',
            'Husaidia kutambua maeneo ya uboreshaji katika sera na utawala wa kodi',
            'Inaunga mkono uundaji wa sera kulingana na ushahidi na mjadala wa umma'
          ]
        }
      }
    },
    {
      id: 'reading',
      titleEn: 'How to Read Tax Data',
      titleSw: 'Jinsi ya Kusoma Data za Kodi',
      icon: <MenuBookIcon />,
      content: {
        en: {
          intro: 'Understanding tax data helps you make informed decisions and participate in public discourse.',
          points: [
            'Revenue figures show total taxes collected in Tanzanian Shillings (TZS)',
            'Compliance rates indicate the percentage of taxpayers meeting their obligations',
            'Regional data helps understand economic distribution across Tanzania',
            'Tax type breakdowns show which taxes contribute most to government revenue',
            'Trend analysis reveals patterns over time and seasonal variations'
          ]
        },
        sw: {
          intro: 'Kuelewa data za kodi kunakusaidia kufanya maamuzi sahihi na kushiriki katika mazungumzo ya umma.',
          points: [
            'Takwimu za mapato zinaonyesha jumla ya kodi zilizokusanywa kwa Shilingi za Kitanzania (TZS)',
            'Viwango vya kufuata sheria vinaonyesha asilimia ya walipakodi wanaotimiza majukumu yao',
            'Data za mikoa zinasaidia kuelewa mgawanyo wa kiuchumi kote Tanzania',
            'Mgawanyo wa aina za kodi unaonyesha ni kodi zipi zinachangia zaidi mapato ya serikali',
            'Uchambuzi wa mielekeo unafunua mifumo ya wakati na mabadiliko ya misimu'
          ]
        }
      }
    },
    {
      id: 'rights',
      titleEn: 'Your Rights as a Citizen',
      titleSw: 'Haki Zako kama Raia',
      icon: <AccountBalanceIcon />,
      content: {
        en: {
          intro: 'As a Tanzanian citizen, you have specific rights regarding tax information and government accountability.',
          points: [
            'Right to access public information about tax collection and spending',
            'Right to understand how tax policies affect you and your community',
            'Right to provide feedback on tax administration and policy',
            'Right to fair and transparent treatment by tax authorities',
            'Right to appeal tax decisions through proper legal channels'
          ]
        },
        sw: {
          intro: 'Kama raia wa Tanzania, una haki maalum kuhusu taarifa za kodi na uwajibikaji wa serikali.',
          points: [
            'Haki ya kupata taarifa za umma kuhusu ukusanyaji wa kodi na matumizi',
            'Haki ya kuelewa jinsi sera za kodi zinavyokuathiri wewe na jamii yako',
            'Haki ya kutoa maoni kuhusu utawala na sera za kodi',
            'Haki ya kupata matibabu ya haki na uwazi kutoka kwa mamlaka za kodi',
            'Haki ya kukata rufaa maamuzi ya kodi kupitia njia sahihi za kisheria'
          ]
        }
      }
    },
    {
      id: 'impact',
      titleEn: 'Understanding Tax Impact',
      titleSw: 'Kuelewa Athari za Kodi',
      icon: <TrendingUpIcon />,
      content: {
        en: {
          intro: 'Taxes fund essential public services and development projects that benefit all Tanzanians.',
          points: [
            'Healthcare services and medical facilities across the country',
            'Education infrastructure including schools and universities',
            'Transportation networks including roads, railways, and airports',
            'Social protection programs for vulnerable populations',
            'Economic development initiatives and job creation programs'
          ]
        },
        sw: {
          intro: 'Kodi hufadhili huduma muhimu za umma na miradi ya maendeleo yanayowafaidhi Watanzania wote.',
          points: [
            'Huduma za afya na vituo vya matibabu kote nchini',
            'Miundombinu ya elimu ikiwa ni pamoja na shule na vyuo vikuu',
            'Mitandao ya usafiri ikiwa ni pamoja na barabara, reli, na viwanja vya ndege',
            'Mipango ya ulinzi wa kijamii kwa vikundi vya hatarini',
            'Mipango ya maendeleo ya kiuchumi na kuunda ajira'
          ]
        }
      }
    }
  ];

  const getCurrentContent = (section) => {
    return i18n.language === 'sw' ? section.content.sw : section.content.en;
  };

  const getCurrentTitle = (section) => {
    return i18n.language === 'sw' ? section.titleSw : section.titleEn;
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              {t('education.title')}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Learn about tax transparency, your rights, and how to interpret the data presented in this portal.
          </Typography>

          {/* Quick Access Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {educationSections.map((section) => (
              <Chip
                key={section.id}
                label={getCurrentTitle(section)}
                onClick={() => setExpanded(section.id)}
                variant={expanded === section.id ? 'filled' : 'outlined'}
                color="primary"
                icon={section.icon}
                clickable
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Education Sections */}
      {educationSections.map((section) => {
        const content = getCurrentContent(section);
        return (
          <Accordion
            key={section.id}
            expanded={expanded === section.id}
            onChange={handleAccordionChange(section.id)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {section.icon}
                <Typography variant="h6">
                  {getCurrentTitle(section)}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {content.intro}
                </Typography>
                
                <List>
                  {content.points.map((point, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Additional Resources */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon color="primary" />
            Data Security & Privacy
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Data Protection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All data presented in this portal is aggregated and anonymized to protect individual privacy 
                while maintaining transparency. No personal information is displayed or stored.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Data Sources
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Information comes from official TRA records, verified through multiple validation processes 
                to ensure accuracy and reliability of the presented data.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="info" />
              For questions about this data or to request additional information, 
              please use the feedback form or contact TRA directly through official channels.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CivicEducation;
