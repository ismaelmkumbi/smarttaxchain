import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Fade,
  Zoom,
  Collapse,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Block,
  Security,
  Verified,
  Warning,
  AccessTime,
  Link,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useTransactionStore from '../../../store/transactionStore';

const BlockchainAnimation = ({ transaction }) => {
  const { t } = useTranslation();
  const { transactions } = useTransactionStore();
  const [animatingTransaction, setAnimatingTransaction] = useState(null);
  const [blockFormationStage, setBlockFormationStage] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const animationRef = useRef(null);

  // Animation stages: 0=idle, 1=validating, 2=mining, 3=confirmed, 4=added to chain
  const animationStages = [
    { label: t('simulation.idle', 'Idle'), color: 'default' },
    { label: t('simulation.validating', 'Validating Transaction'), color: 'info' },
    { label: t('simulation.mining', 'Mining Block'), color: 'warning' },
    { label: t('simulation.confirming', 'Confirming Block'), color: 'primary' },
    { label: t('simulation.confirmed', 'Added to Chain'), color: 'success' },
  ];

  // Animate new transactions
  useEffect(() => {
    if (transaction && transaction !== animatingTransaction) {
      setAnimatingTransaction(transaction);
      setBlockFormationStage(1);

      // Simulate blockchain processing stages
      const stages = [1, 2, 3, 4];
      stages.forEach((stage, index) => {
        setTimeout(
          () => {
            setBlockFormationStage(stage);
            if (stage === 4) {
              setTimeout(() => {
                setBlockFormationStage(0);
                setShowTimeline(true);
              }, 1500);
            }
          },
          (index + 1) * 1200,
        );
      });
    }
  }, [transaction, animatingTransaction]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-TZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getRecentBlocks = () => {
    return transactions.slice(-5).reverse();
  };

  const BlockVisualization = ({ block, isAnimating = false }) => (
    <Zoom in={true} timeout={500}>
      <Card
        sx={{
          minWidth: 200,
          m: 1,
          border: 2,
          borderColor: block.fraudDetected ? 'error.main' : 'success.main',
          backgroundColor: isAnimating ? 'action.hover' : 'background.paper',
          transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease-in-out',
          boxShadow: isAnimating ? 4 : 1,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Block color={block.fraudDetected ? 'error' : 'primary'} sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              {t('simulation.block', 'Block')} #{block.blockNumber}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {formatTime(block.timestamp)}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={formatCurrency(block.originalAmount)}
              color="info"
              variant="outlined"
            />
            <Chip
              size="small"
              label={`VAT: ${formatCurrency(block.calculatedVAT)}`}
              color={block.fraudDetected ? 'error' : 'success'}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip
              size="small"
              icon={block.fraudDetected ? <Warning /> : <CheckCircle />}
              label={
                block.fraudDetected
                  ? t('simulation.fraud', 'Fraud')
                  : t('simulation.verified', 'Verified')
              }
              color={block.fraudDetected ? 'error' : 'success'}
            />
            <Typography variant="caption">{block.businessCategory}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  return (
    <Box
      ref={animationRef}
      sx={{
        p: 2,
        border: 1,
        borderRadius: 2,
        borderColor: 'grey.300',
        background: 'white',
        minHeight: 400,
        maxHeight: 800,
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t('simulation.blockchainPanel', 'Smart Tax Chain Blockchain')}
      </Typography>

      {/* Animation Status */}
      {blockFormationStage > 0 && (
        <Fade in={true}>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Security color="info" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">
                {animationStages[blockFormationStage].label}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(blockFormationStage / 4) * 100}
              sx={{ mb: 1 }}
            />
            {animatingTransaction && (
              <Typography variant="caption" color="text.secondary">
                {t('simulation.processingTransaction', 'Processing transaction of {{amount}}', {
                  amount: formatCurrency(animatingTransaction.originalAmount),
                })}
              </Typography>
            )}
          </Paper>
        </Fade>
      )}

      {/* Current Transaction Block */}
      {transaction && blockFormationStage === 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('simulation.latestBlock', 'Latest Block')}
          </Typography>
          <BlockVisualization block={transaction} isAnimating={blockFormationStage > 0} />
        </Box>
      )}

      {/* Blockchain Timeline */}
      <Collapse in={showTimeline && transactions.length > 0}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('simulation.blockchainHistory', 'Blockchain History')} ({transactions.length}{' '}
            {t('simulation.blocks', 'blocks')})
          </Typography>

          <Timeline position="alternate">
            {getRecentBlocks().map((block, index) => (
              <TimelineItem key={block.id}>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  align={index % 2 === 0 ? 'right' : 'left'}
                  variant="caption"
                  color="text.secondary"
                >
                  {formatTime(block.timestamp)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color={block.fraudDetected ? 'error' : 'success'}>
                    {block.fraudDetected ? <Error /> : <Verified />}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Card variant="outlined" sx={{ maxWidth: 200 }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Block #{block.blockNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(block.originalAmount)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={block.fraudDetected ? 'error' : 'success'}
                      >
                        {block.fraudDetected
                          ? t('simulation.fraudDetected', 'Fraud Detected')
                          : t('simulation.verified', 'Verified')}
                      </Typography>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Collapse>

      {/* Blockchain Stats */}
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Link color="primary" />
            <Typography variant="caption">
              {t('simulation.chainLength', 'Chain Length')}: {transactions.length}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime color="info" />
            <Typography variant="caption">
              {t('simulation.lastBlock', 'Last Block')}:{' '}
              {transactions.length > 0
                ? formatTime(transactions[transactions.length - 1].timestamp)
                : t('simulation.none', 'None')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Security color={transactions.some((tx) => tx.fraudDetected) ? 'warning' : 'success'} />
            <Typography variant="caption">
              {t('simulation.integrity', 'Chain Integrity')}:{' '}
              {transactions.some((tx) => tx.fraudDetected)
                ? t('simulation.alertsActive', 'Alerts Active')
                : t('simulation.secure', 'Secure')}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* No transactions state */}
      {transactions.length === 0 && blockFormationStage === 0 && (
        <Paper sx={{ p: 3, mt: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Block sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {t('simulation.emptyBlockchain', 'Blockchain is empty')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              'simulation.startSimulation',
              'Generate transactions to see the blockchain in action',
            )}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

BlockchainAnimation.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string,
    originalAmount: PropTypes.number,
    calculatedVAT: PropTypes.number,
    reportedVAT: PropTypes.number,
    fraudDetected: PropTypes.bool,
    timestamp: PropTypes.string,
    blockNumber: PropTypes.number,
    businessCategory: PropTypes.string,
  }),
};

BlockchainAnimation.defaultProps = {
  transaction: null,
};

export default BlockchainAnimation;
