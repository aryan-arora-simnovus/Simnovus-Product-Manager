# SSH Keys Placeholder

Place your SSH private key file here with the name `id_rsa`

To generate a new SSH key pair, run:
```bash
ssh-keygen -t rsa -b 4096 -f id_rsa -N ""
```

The private key should be placed in this directory and the public key (id_rsa.pub) 
should be added to the authorized_keys on your target servers.

**Security Note**: 
- Never commit private keys to version control
- Add this folder to .gitignore
- Ensure proper file permissions: chmod 600 id_rsa
