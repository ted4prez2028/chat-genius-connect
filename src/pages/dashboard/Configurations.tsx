
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Mail, BellRing, Globe, ShieldCheck, CreditCard, Users } from "lucide-react";

const Configurations = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Food Truck Community",
    siteTagline: "Connecting food trucks with hungry customers",
    logoUrl: "/lovable-uploads/8f3a17ee-e82b-44f4-b17a-f8c1924ba4b2.png",
    favicon: "/favicon.ico",
    contactEmail: "support@foodtruckcommunity.com",
    phoneNumber: "(555) 123-4567",
    address: "123 Food Truck Lane, Foodville, CA 94321",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSmsNotifications: false,
    dailyDigest: true,
    marketingEmails: false,
    systemAlerts: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    cookieConsent: true,
    dataRetentionDays: "90",
    anonymizeIpAddresses: false,
    allowThirdPartyTracking: true,
    showPrivacyPolicyPopup: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "USD",
    taxRate: "7.5",
    stripeEnabled: true,
    paypalEnabled: false,
    applePay: true,
    googlePay: true,
    invoiceDueDays: "30",
  });

  const [userSettings, setUserSettings] = useState({
    allowUserRegistration: true,
    requireEmailVerification: true,
    allowSocialLogin: true,
    defaultUserRole: "customer",
    passwordMinLength: "8",
    passwordRequiresSpecialChar: true,
    sessionTimeoutMinutes: "60",
  });

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully!");
  };

  const handleSavePrivacy = () => {
    toast.success("Privacy settings saved successfully!");
  };

  const handleSavePayment = () => {
    toast.success("Payment settings saved successfully!");
  };

  const handleSaveUser = () => {
    toast.success("User settings saved successfully!");
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">CONFIGURATIONS</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the basic information about your food truck platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Site Tagline</Label>
                  <Input 
                    id="siteTagline"
                    value={generalSettings.siteTagline}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteTagline: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input 
                    id="logoUrl"
                    value={generalSettings.logoUrl}
                    onChange={(e) => setGeneralSettings({...generalSettings, logoUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input 
                    id="favicon"
                    value={generalSettings.favicon}
                    onChange={(e) => setGeneralSettings({...generalSettings, favicon: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea 
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" />
                Save General Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent to users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch 
                  id="emailNotifications"
                  checked={notificationSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings, 
                    enableEmailNotifications: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch 
                  id="pushNotifications"
                  checked={notificationSettings.enablePushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings, 
                    enablePushNotifications: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text messages for urgent updates
                  </p>
                </div>
                <Switch 
                  id="smsNotifications"
                  checked={notificationSettings.enableSmsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings, 
                    enableSmsNotifications: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dailyDigest">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of activity once per day
                  </p>
                </div>
                <Switch 
                  id="dailyDigest"
                  checked={notificationSettings.dailyDigest}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings, 
                    dailyDigest: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional content and special offers
                  </p>
                </div>
                <Switch 
                  id="marketingEmails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings, 
                    marketingEmails: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about system status and maintenance
                  </p>
                </div>
                <Switch 
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings, 
                    systemAlerts: checked
                  })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <Mail className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Configure how user data is handled and stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cookieConsent">Cookie Consent Banner</Label>
                  <p className="text-sm text-muted-foreground">
                    Show a cookie consent banner to users
                  </p>
                </div>
                <Switch 
                  id="cookieConsent"
                  checked={privacySettings.cookieConsent}
                  onCheckedChange={(checked) => setPrivacySettings({
                    ...privacySettings, 
                    cookieConsent: checked
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention (days)</Label>
                <Input 
                  id="dataRetention"
                  type="number"
                  value={privacySettings.dataRetentionDays}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings, 
                    dataRetentionDays: e.target.value
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  How long to keep user data before automatic deletion
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymizeIp">Anonymize IP Addresses</Label>
                  <p className="text-sm text-muted-foreground">
                    Store IP addresses in an anonymized format
                  </p>
                </div>
                <Switch 
                  id="anonymizeIp"
                  checked={privacySettings.anonymizeIpAddresses}
                  onCheckedChange={(checked) => setPrivacySettings({
                    ...privacySettings, 
                    anonymizeIpAddresses: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="thirdPartyTracking">Allow Third-Party Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow third-party services to track user behavior
                  </p>
                </div>
                <Switch 
                  id="thirdPartyTracking"
                  checked={privacySettings.allowThirdPartyTracking}
                  onCheckedChange={(checked) => setPrivacySettings({
                    ...privacySettings, 
                    allowThirdPartyTracking: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacyPopup">Show Privacy Policy Popup</Label>
                  <p className="text-sm text-muted-foreground">
                    Show a privacy policy popup to new users
                  </p>
                </div>
                <Switch 
                  id="privacyPopup"
                  checked={privacySettings.showPrivacyPolicyPopup}
                  onCheckedChange={(checked) => setPrivacySettings({
                    ...privacySettings, 
                    showPrivacyPolicyPopup: checked
                  })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and options for transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={paymentSettings.currency}
                    onValueChange={(value) => setPaymentSettings({
                      ...paymentSettings, 
                      currency: value
                    })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input 
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={paymentSettings.taxRate}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings, 
                      taxRate: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stripeEnabled">Enable Stripe</Label>
                  <p className="text-sm text-muted-foreground">
                    Process payments through Stripe
                  </p>
                </div>
                <Switch 
                  id="stripeEnabled"
                  checked={paymentSettings.stripeEnabled}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings, 
                    stripeEnabled: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paypalEnabled">Enable PayPal</Label>
                  <p className="text-sm text-muted-foreground">
                    Process payments through PayPal
                  </p>
                </div>
                <Switch 
                  id="paypalEnabled"
                  checked={paymentSettings.paypalEnabled}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings, 
                    paypalEnabled: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="applePay">Enable Apple Pay</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow payments via Apple Pay
                  </p>
                </div>
                <Switch 
                  id="applePay"
                  checked={paymentSettings.applePay}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings, 
                    applePay: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="googlePay">Enable Google Pay</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow payments via Google Pay
                  </p>
                </div>
                <Switch 
                  id="googlePay"
                  checked={paymentSettings.googlePay}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings, 
                    googlePay: checked
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDueDays">Invoice Due Days</Label>
                <Input 
                  id="invoiceDueDays"
                  type="number"
                  value={paymentSettings.invoiceDueDays}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings, 
                    invoiceDueDays: e.target.value
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Number of days before an invoice is due
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePayment}>
                <CreditCard className="mr-2 h-4 w-4" />
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>
                Configure user account settings and security policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowRegistration">Allow User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch 
                  id="allowRegistration"
                  checked={userSettings.allowUserRegistration}
                  onCheckedChange={(checked) => setUserSettings({
                    ...userSettings, 
                    allowUserRegistration: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require users to verify their email addresses
                  </p>
                </div>
                <Switch 
                  id="emailVerification"
                  checked={userSettings.requireEmailVerification}
                  onCheckedChange={(checked) => setUserSettings({
                    ...userSettings, 
                    requireEmailVerification: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="socialLogin">Allow Social Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to login with social media accounts
                  </p>
                </div>
                <Switch 
                  id="socialLogin"
                  checked={userSettings.allowSocialLogin}
                  onCheckedChange={(checked) => setUserSettings({
                    ...userSettings, 
                    allowSocialLogin: checked
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultRole">Default User Role</Label>
                <Select 
                  value={userSettings.defaultUserRole}
                  onValueChange={(value) => setUserSettings({
                    ...userSettings, 
                    defaultUserRole: value
                  })}
                >
                  <SelectTrigger id="defaultRole">
                    <SelectValue placeholder="Select default role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordLength">Minimum Password Length</Label>
                <Input 
                  id="passwordLength"
                  type="number"
                  min="6"
                  max="32"
                  value={userSettings.passwordMinLength}
                  onChange={(e) => setUserSettings({
                    ...userSettings, 
                    passwordMinLength: e.target.value
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="specialChar">Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">
                    Require passwords to contain special characters
                  </p>
                </div>
                <Switch 
                  id="specialChar"
                  checked={userSettings.passwordRequiresSpecialChar}
                  onCheckedChange={(checked) => setUserSettings({
                    ...userSettings, 
                    passwordRequiresSpecialChar: checked
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input 
                  id="sessionTimeout"
                  type="number"
                  value={userSettings.sessionTimeoutMinutes}
                  onChange={(e) => setUserSettings({
                    ...userSettings, 
                    sessionTimeoutMinutes: e.target.value
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Time of inactivity before users are logged out
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveUser}>
                <Users className="mr-2 h-4 w-4" />
                Save User Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configurations;
