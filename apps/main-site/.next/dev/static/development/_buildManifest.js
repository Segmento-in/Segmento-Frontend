self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/pulse"
      },
      {
        "source": "/pulse/:path*"
      },
      {
        "source": "/products/data-classification"
      },
      {
        "source": "/products/data-classification/:path*"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()