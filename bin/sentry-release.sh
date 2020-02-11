export SENTRY_AUTH_TOKEN=605dbd2984e449d79308e0777137d30f1b1fdfb6f8314b588915e43c09e3547a
export SENTRY_ORG=leofalco

VERSION=$(git describe --abbrev=0 --tags)
sentry-cli releases new -p gql $VERSION --log-level=info
sentry-cli releases set-commits --auto $VERSION hero--log-level=info
sentry-cli releases finalize $VERSION --log-level=info
