# Vercel Deployment Guide for Secret Poll Verse

This guide provides step-by-step instructions for deploying the Secret Poll Verse application to Vercel.

## Prerequisites

- GitHub account with the project repository
- Vercel account (free tier available)
- Environment variables configured

## Step-by-Step Deployment Process

### 1. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### 2. Import Project

1. In your Vercel dashboard, click "New Project"
2. Find and select your `secret-poll-verse` repository
3. Click "Import"

### 3. Configure Build Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (./)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4. Set Environment Variables

In the "Environment Variables" section, add the following variables:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
NEXT_PUBLIC_POLL_CONTRACT_ADDRESS=
NEXT_PUBLIC_FHE_CONTRACT_ADDRESS=
```

**Important**: Replace the contract addresses with actual deployed contract addresses when available.

### 5. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Your application will be available at the provided Vercel URL

### 6. Custom Domain (Optional)

1. In your project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for SSL certificate to be issued

## Post-Deployment Configuration

### 1. Update Contract Addresses

After deploying your smart contracts to Sepolia testnet:

1. Go to your Vercel project settings
2. Update the environment variables with actual contract addresses
3. Redeploy the application

### 2. Test the Application

1. Visit your deployed URL
2. Connect a wallet (MetaMask, Rainbow, etc.)
3. Create a test poll
4. Verify all functionality works correctly

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are properly installed
   - Verify TypeScript compilation errors
   - Ensure all imports are correct

2. **Environment Variables Not Working**
   - Make sure variables are prefixed with `NEXT_PUBLIC_`
   - Redeploy after adding new variables
   - Check variable names match exactly

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure chain ID matches Sepolia (11155111)

### Build Logs

If deployment fails:
1. Go to your project dashboard
2. Click on the failed deployment
3. Check the build logs for specific error messages
4. Fix issues and redeploy

## Performance Optimization

### 1. Enable Edge Functions (Optional)

For better performance:
1. Go to "Functions" tab in project settings
2. Enable Edge Functions if needed

### 2. Configure Caching

1. Add `vercel.json` to your project root:
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings for usage insights
2. **Error Tracking**: Monitor deployment logs for issues
3. **Performance**: Use Vercel's built-in performance monitoring

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to repository
2. **API Keys**: Rotate keys regularly
3. **HTTPS**: Vercel provides SSL certificates automatically
4. **CORS**: Configure if needed for API calls

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- GitHub Issues: Create issues in your repository for bugs
- Community: Join Vercel Discord for community support

## Deployment Checklist

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Initial deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] Contract addresses updated
- [ ] Application tested thoroughly
- [ ] Performance optimized
- [ ] Monitoring enabled

Your Secret Poll Verse application should now be successfully deployed and accessible to users worldwide!
