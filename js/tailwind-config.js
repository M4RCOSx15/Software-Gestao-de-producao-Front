// Configuração compartilhada de design tokens do Tailwind (extraída dos protótipos)
// usada por todas as páginas do ProdManager.
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "on-secondary-fixed": "#0f0069",
                      "on-primary-container": "#eeefff",
                      "on-surface-variant": "#434655",
                      "on-tertiary-fixed": "#360f00",
                      "surface-container-high": "#e6e8ea",
                      "error-container": "#ffdad6",
                      "tertiary-fixed-dim": "#ffb596",
                      "on-secondary-fixed-variant": "#3323cc",
                      "surface-container-low": "#f2f4f6",
                      "surface-container-lowest": "#ffffff",
                      "surface-dim": "#d8dadc",
                      "surface-container-highest": "#e0e3e5",
                      "surface-variant": "#e0e3e5",
                      "primary": "#004ac6",
                      "on-primary-fixed-variant": "#003ea8",
                      "surface-bright": "#f7f9fb",
                      "on-tertiary-fixed-variant": "#7d2d00",
                      "on-secondary": "#ffffff",
                      "tertiary-fixed": "#ffdbcd",
                      "error": "#ba1a1a",
                      "on-error-container": "#93000a",
                      "outline-variant": "#c3c6d7",
                      "secondary-fixed-dim": "#c3c0ff",
                      "secondary-container": "#645efb",
                      "background": "#f7f9fb",
                      "on-primary": "#ffffff",
                      "secondary": "#4b41e1",
                      "secondary-fixed": "#e2dfff",
                      "tertiary-container": "#bc4800",
                      "on-primary-fixed": "#00174b",
                      "primary-fixed": "#dbe1ff",
                      "on-error": "#ffffff",
                      "inverse-primary": "#b4c5ff",
                      "on-background": "#191c1e",
                      "on-surface": "#191c1e",
                      "on-tertiary": "#ffffff",
                      "inverse-surface": "#2d3133",
                      "surface-container": "#eceef0",
                      "surface-tint": "#0053db",
                      "primary-fixed-dim": "#b4c5ff",
                      "primary-container": "#2563eb",
                      "on-secondary-container": "#fffbff",
                      "outline": "#737686",
                      "on-tertiary-container": "#ffede6",
                      "inverse-on-surface": "#eff1f3",
                      "tertiary": "#943700",
                      "surface": "#f7f9fb"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "stack-gap-md": "1rem",
                      "container-padding-sm": "1rem",
                      "unit": "4px",
                      "stack-gap-sm": "0.5rem",
                      "gutter": "1.5rem",
                      "container-padding-lg": "2rem",
                      "container-padding-md": "1.5rem"
              },
              "fontFamily": {
                      "body-md": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Inter"
                      ],
                      "code-sm": [
                              "Inter"
                      ],
                      "body-lg": [
                              "Inter"
                      ],
                      "headline-lg-mobile": [
                              "Inter"
                      ],
                      "title-md": [
                              "Inter"
                      ],
                      "headline-lg": [
                              "Inter"
                      ],
                      "label-md": [
                              "Inter"
                      ],
                      "display-lg": [
                              "Inter"
                      ]
              },
              "fontSize": {
                      "body-md": [
                              "14px",
                              {
                                      "lineHeight": "20px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "600"
                              }
                      ],
                      "code-sm": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-lg": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg-mobile": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "600"
                              }
                      ],
                      "title-md": [
                              "18px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "40px",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "600"
                              }
                      ],
                      "label-md": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.02em",
                                      "fontWeight": "500"
                              }
                      ],
                      "display-lg": [
                              "48px",
                              {
                                      "lineHeight": "56px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "700"
                              }
                      ]
              }
      },
          },
        }
