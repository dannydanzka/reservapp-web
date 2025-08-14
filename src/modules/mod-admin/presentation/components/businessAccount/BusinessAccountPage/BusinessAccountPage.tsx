'use client';

import React, { useEffect, useState } from 'react';

import {
  AlertCircle,
  Building2,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@ui/Button';
import { useAuth } from '@providers/AuthProvider';
import { useToast } from '@providers/ToastProvider';
import { useTranslation } from '@i18n/index';

import { BusinessAccountPageProps } from './BusinessAccountPage.interfaces';

import {
  AddBankButton,
  BankAccountActions,
  BankAccountCard,
  BankAccountHeader,
  BankAccountInfo,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckboxGroup,
  CheckboxInput,
  CheckboxLabel,
  CompletionCard,
  CompletionIcon,
  CompletionItem,
  CompletionList,
  CompletionText,
  CompletionTitle,
  Container,
  ContentGrid,
  ErrorMessage,
  FormGroup,
  FormRow,
  FormSection,
  Header,
  InfoBox,
  InfoText,
  InfoTitle,
  Input,
  Label,
  ProgressBar,
  ProgressFill,
  ProgressText,
  SaveButton,
  SectionDescription,
  SectionTitle,
  Select,
  StatusBadge,
  Subtitle,
  SuccessMessage,
  TextArea,
  Title,
} from './BusinessAccountPage.styled';

/**
 * Business Account management page component.
 * Allows businesses to complete their profile and manage bank accounts.
 */
export const BusinessAccountPage: React.FC<BusinessAccountPageProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Business details state
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [businessGiros, setBusinessGiros] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  // Bank account state
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({
    accountHolder: '',
    accountNumber: '',
    accountType: 'CHECKING',
    bankName: '',
    clabe: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0;
    const total = 10;

    if (businessName) completed++;
    if (taxId) completed++;
    if (businessGiros.length > 0) completed++;
    if (address) completed++;
    if (city && state) completed++;
    if (zipCode) completed++;
    if (phone) completed++;
    if (email) completed++;
    if (description) completed++;
    if (bankAccounts.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleGiroChange = (giro: string, checked: boolean) => {
    if (checked) {
      setBusinessGiros((prev) => [...prev, giro]);
    } else {
      setBusinessGiros((prev) => prev.filter((g) => g !== giro));
    }
  };

  const handleSaveBusinessDetails = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement API call to save business details
      showToast({
        description: t('admin.businessAccount.success.saved'),
        title: t('admin.businessAccount.success.title'),
        variant: 'success',
      });
      setSuccess(t('admin.businessAccount.success.saved'));
    } catch (err) {
      console.error('Error saving business details:', err);
      setError(t('admin.businessAccount.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (!newBankAccount.bankName || !newBankAccount.accountNumber) {
      setError(t('admin.businessAccount.errors.missingBankInfo'));
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to add bank account
      setBankAccounts([...bankAccounts, { ...newBankAccount, id: Date.now() }]);
      setNewBankAccount({
        accountHolder: '',
        accountNumber: '',
        accountType: 'CHECKING',
        bankName: '',
        clabe: '',
      });
      setShowAddBank(false);
      showToast({
        description: t('admin.businessAccount.success.bankAdded'),
        title: t('admin.businessAccount.success.title'),
        variant: 'success',
      });
    } catch (err) {
      console.error('Error adding bank account:', err);
      setError(t('admin.businessAccount.errors.bankAddFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBankAccount = async (bankId: number) => {
    if (!confirm(t('admin.businessAccount.confirmDeleteBank'))) return;

    try {
      // TODO: Implement API call to delete bank account
      setBankAccounts(bankAccounts.filter((bank) => bank.id !== bankId));
      showToast({
        description: t('admin.businessAccount.success.bankDeleted'),
        title: t('admin.businessAccount.success.title'),
        variant: 'success',
      });
    } catch (err) {
      console.error('Error deleting bank account:', err);
      setError(t('admin.businessAccount.errors.bankDeleteFailed'));
    }
  };

  const completionPercentage = calculateCompletion();

  return (
    <Container>
      <Header>
        <Title>{t('admin.businessAccount.title')}</Title>
        <Subtitle>{t('admin.businessAccount.subtitle')}</Subtitle>
      </Header>

      {/* Profile Completion Progress */}
      <CompletionCard>
        <CompletionIcon $isComplete={completionPercentage === 100}>
          {completionPercentage === 100 ? <Check size={32} /> : <AlertCircle size={32} />}
        </CompletionIcon>
        <div>
          <CompletionTitle>
            {completionPercentage === 100
              ? t('admin.businessAccount.completion.complete')
              : t('admin.businessAccount.completion.incomplete')}
          </CompletionTitle>
          <CompletionText>
            {t('admin.businessAccount.completion.text', { percentage: completionPercentage })}
          </CompletionText>
          <ProgressBar>
            <ProgressFill $percentage={completionPercentage} />
          </ProgressBar>
          <ProgressText>
            {completionPercentage}% {t('admin.businessAccount.completion.completed')}
          </ProgressText>
        </div>
      </CompletionCard>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <ContentGrid>
        {/* Business Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 size={20} />
              {t('admin.businessAccount.businessInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormRow>
                <FormGroup>
                  <Label>{t('admin.businessAccount.businessInfo.businessName')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.businessInfo.businessNamePlaceholder')}
                    type='text'
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('admin.businessAccount.businessInfo.taxId')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.businessInfo.taxIdPlaceholder')}
                    type='text'
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>{t('admin.businessAccount.businessInfo.businessGiros')}</Label>
                <CheckboxGroup>
                  {[
                    'hospitality',
                    'food',
                    'wellness',
                    'tourism',
                    'events',
                    'entertainment',
                    'retail',
                    'services',
                  ].map((giro) => (
                    <CheckboxLabel key={giro}>
                      <CheckboxInput
                        checked={businessGiros.includes(giro)}
                        type='checkbox'
                        onChange={(e) => handleGiroChange(giro, e.target.checked)}
                      />
                      {t(`admin.businessAccount.giros.${giro}`)}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t('admin.businessAccount.businessInfo.description')}</Label>
                <TextArea
                  placeholder={t('admin.businessAccount.businessInfo.descriptionPlaceholder')}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>
            </FormSection>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Phone size={20} />
              {t('admin.businessAccount.contactInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormGroup>
                <Label>{t('admin.businessAccount.contactInfo.address')}</Label>
                <Input
                  placeholder={t('admin.businessAccount.contactInfo.addressPlaceholder')}
                  type='text'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>{t('admin.businessAccount.contactInfo.city')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.contactInfo.cityPlaceholder')}
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('admin.businessAccount.contactInfo.state')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.contactInfo.statePlaceholder')}
                    type='text'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('admin.businessAccount.contactInfo.zipCode')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.contactInfo.zipCodePlaceholder')}
                    type='text'
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>{t('admin.businessAccount.contactInfo.phone')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.contactInfo.phonePlaceholder')}
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('admin.businessAccount.contactInfo.email')}</Label>
                  <Input
                    placeholder={t('admin.businessAccount.contactInfo.emailPlaceholder')}
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>{t('admin.businessAccount.contactInfo.website')}</Label>
                <Input
                  placeholder={t('admin.businessAccount.contactInfo.websitePlaceholder')}
                  type='url'
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </FormGroup>

              <SaveButton disabled={loading} onClick={handleSaveBusinessDetails}>
                <Save size={20} />
                {loading ? t('common.saving') : t('admin.businessAccount.saveChanges')}
              </SaveButton>
            </FormSection>
          </CardContent>
        </Card>
      </ContentGrid>

      {/* Bank Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <CreditCard size={20} />
            {t('admin.businessAccount.bankAccounts.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SectionDescription>
            {t('admin.businessAccount.bankAccounts.description')}
          </SectionDescription>

          {/* Info Box */}
          <InfoBox>
            <DollarSign size={20} />
            <div>
              <InfoTitle>{t('admin.businessAccount.bankAccounts.infoTitle')}</InfoTitle>
              <InfoText>{t('admin.businessAccount.bankAccounts.infoText')}</InfoText>
            </div>
          </InfoBox>

          {/* Bank Accounts List */}
          {bankAccounts.map((bank) => (
            <BankAccountCard key={bank.id}>
              <BankAccountHeader>
                <strong>{bank.bankName}</strong>
                <StatusBadge $status='active'>
                  {t('admin.businessAccount.bankAccounts.active')}
                </StatusBadge>
              </BankAccountHeader>
              <BankAccountInfo>
                <div>
                  {t('admin.businessAccount.bankAccounts.accountHolder')}: {bank.accountHolder}
                </div>
                <div>
                  {t('admin.businessAccount.bankAccounts.accountNumber')}: ****
                  {bank.accountNumber.slice(-4)}
                </div>
                <div>
                  {t('admin.businessAccount.bankAccounts.accountType')}:{' '}
                  {t(`admin.businessAccount.accountTypes.${bank.accountType.toLowerCase()}`)}
                </div>
                {bank.clabe && <div>CLABE: {bank.clabe}</div>}
              </BankAccountInfo>
              <BankAccountActions>
                <Button
                  size='small'
                  variant='text'
                  onClick={() => handleDeleteBankAccount(bank.id)}
                >
                  <Trash2 size={16} />
                  {t('common.delete')}
                </Button>
              </BankAccountActions>
            </BankAccountCard>
          ))}

          {/* Add Bank Account Form */}
          {showAddBank ? (
            <Card>
              <CardContent>
                <FormSection>
                  <FormRow>
                    <FormGroup>
                      <Label>{t('admin.businessAccount.bankAccounts.bankName')}</Label>
                      <Input
                        placeholder={t('admin.businessAccount.bankAccounts.bankNamePlaceholder')}
                        type='text'
                        value={newBankAccount.bankName}
                        onChange={(e) =>
                          setNewBankAccount({ ...newBankAccount, bankName: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>{t('admin.businessAccount.bankAccounts.accountHolder')}</Label>
                      <Input
                        placeholder={t(
                          'admin.businessAccount.bankAccounts.accountHolderPlaceholder'
                        )}
                        type='text'
                        value={newBankAccount.accountHolder}
                        onChange={(e) =>
                          setNewBankAccount({ ...newBankAccount, accountHolder: e.target.value })
                        }
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>{t('admin.businessAccount.bankAccounts.accountNumber')}</Label>
                      <Input
                        placeholder={t(
                          'admin.businessAccount.bankAccounts.accountNumberPlaceholder'
                        )}
                        type='text'
                        value={newBankAccount.accountNumber}
                        onChange={(e) =>
                          setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>{t('admin.businessAccount.bankAccounts.accountType')}</Label>
                      <Select
                        value={newBankAccount.accountType}
                        onChange={(e) =>
                          setNewBankAccount({ ...newBankAccount, accountType: e.target.value })
                        }
                      >
                        <option value='CHECKING'>
                          {t('admin.businessAccount.accountTypes.checking')}
                        </option>
                        <option value='SAVINGS'>
                          {t('admin.businessAccount.accountTypes.savings')}
                        </option>
                        <option value='BUSINESS'>
                          {t('admin.businessAccount.accountTypes.business')}
                        </option>
                      </Select>
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>
                      {t('admin.businessAccount.bankAccounts.clabe')} ({t('common.optional')})
                    </Label>
                    <Input
                      placeholder={t('admin.businessAccount.bankAccounts.clabePlaceholder')}
                      type='text'
                      value={newBankAccount.clabe}
                      onChange={(e) =>
                        setNewBankAccount({ ...newBankAccount, clabe: e.target.value })
                      }
                    />
                  </FormGroup>

                  <FormRow>
                    <Button disabled={loading} variant='contained' onClick={handleAddBankAccount}>
                      <Check size={20} />
                      {t('admin.businessAccount.bankAccounts.addAccount')}
                    </Button>
                    <Button variant='outlined' onClick={() => setShowAddBank(false)}>
                      {t('common.cancel')}
                    </Button>
                  </FormRow>
                </FormSection>
              </CardContent>
            </Card>
          ) : (
            <AddBankButton onClick={() => setShowAddBank(true)}>
              <Plus size={20} />
              {t('admin.businessAccount.bankAccounts.addNewAccount')}
            </AddBankButton>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
