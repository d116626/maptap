// Generated country database with separated continents and badge statistics (English)
export interface RegionItem {
  id: string;
  name: string;
  flag: string;
  center: [number, number];
  zoom: number;
  badge?: string;
}

export interface RegionTabDefinition {
  id: string;
  label: string;
  icon: string;
  items: RegionItem[];
}

export const REGION_TABS: RegionTabDefinition[] = [
  {
    "id": "main",
    "label": "Highlights",
    "icon": "⭐",
    "items": [
      {
        "id": "ALL",
        "name": "Whole World",
        "flag": "🌍",
        "center": [
          0,
          20
        ],
        "zoom": 1.8,
        "badge": "241 countries"
      },
      {
        "id": "SOUTH_AMERICA",
        "name": "South America",
        "flag": "🌎",
        "center": [
          -58.0,
          -20.0
        ],
        "zoom": 3.2,
        "badge": "13 countries"
      },
      {
        "id": "BRA",
        "name": "Brazil",
        "flag": "🇧🇷",
        "center": [
          -47.89,
          -15.79
        ],
        "zoom": 4.0,
        "badge": "27 regions | 430 cities"
      },
      {
        "id": "NORTH_AMERICA",
        "name": "North America",
        "flag": "🌎",
        "center": [
          -98.57,
          39.82
        ],
        "zoom": 3.2,
        "badge": "39 countries"
      },
      {
        "id": "USA",
        "name": "United States",
        "flag": "🇺🇸",
        "center": [
          -98.57,
          39.82
        ],
        "zoom": 3.8,
        "badge": "51 regions | 720 cities"
      },
      {
        "id": "CAN",
        "name": "Canada",
        "flag": "🇨🇦",
        "center": [
          -106.34,
          56.13
        ],
        "zoom": 3.5,
        "badge": "13 regions | 134 cities"
      },
      {
        "id": "MEX",
        "name": "Mexico",
        "flag": "🇲🇽",
        "center": [
          -102.55,
          23.63
        ],
        "zoom": 4.5,
        "badge": "33 regions | 178 cities"
      },
      {
        "id": "EUR",
        "name": "Europe",
        "flag": "🇪🇺",
        "center": [
          10.0,
          50.0
        ],
        "zoom": 3.8,
        "badge": "53 countries"
      },
      {
        "id": "DEU",
        "name": "Germany",
        "flag": "🇩🇪",
        "center": [
          10.45,
          51.16
        ],
        "zoom": 5.0,
        "badge": "16 regions | 140 cities"
      },
      {
        "id": "FRA",
        "name": "France",
        "flag": "🇫🇷",
        "center": [
          2.21,
          46.22
        ],
        "zoom": 5.0,
        "badge": "18 regions | 124 cities"
      },
      {
        "id": "ESP",
        "name": "Spain",
        "flag": "🇪🇸",
        "center": [
          -3.74,
          40.46
        ],
        "zoom": 5.0,
        "badge": "19 regions | 135 cities"
      },
      {
        "id": "ASIA",
        "name": "Asia",
        "flag": "🌏",
        "center": [
          100.0,
          35.0
        ],
        "zoom": 3.0,
        "badge": "50 countries"
      },
      {
        "id": "CHN",
        "name": "China",
        "flag": "🇨🇳",
        "center": [
          104.19,
          35.86
        ],
        "zoom": 3.8,
        "badge": "32 regions | 801 cities"
      },
      {
        "id": "IND",
        "name": "India",
        "flag": "🇮🇳",
        "center": [
          78.96,
          20.59
        ],
        "zoom": 4.0,
        "badge": "36 regions | 629 cities"
      },
      {
        "id": "JPN",
        "name": "Japan",
        "flag": "🇯🇵",
        "center": [
          138.25,
          36.2
        ],
        "zoom": 4.8,
        "badge": "47 regions | 316 cities"
      },
      {
        "id": "OCEANIA",
        "name": "Oceania",
        "flag": "🏝️",
        "center": [
          133.77,
          -25.27
        ],
        "zoom": 3.5,
        "badge": "28 countries"
      },
      {
        "id": "AUS",
        "name": "Australia",
        "flag": "🇦🇺",
        "center": [
          133.77,
          -25.27
        ],
        "zoom": 3.8,
        "badge": "11 regions | 82 cities"
      },
      {
        "id": "AFRICA",
        "name": "Africa",
        "flag": "🌍",
        "center": [
          20.0,
          5.0
        ],
        "zoom": 3.0,
        "badge": "58 countries"
      }
    ]
  },
  {
    "id": "south_america",
    "label": "S. America",
    "icon": "🌎",
    "items": [
      {
        "id": "SOUTH_AMERICA",
        "name": "South America",
        "flag": "🌎",
        "center": [
          -58.0,
          -20.0
        ],
        "zoom": 3.2,
        "badge": "13 países"
      },
      {
        "id": "ARG",
        "name": "Argentina",
        "flag": "🇦🇷",
        "center": [
          -64,
          -34
        ],
        "zoom": 4.5,
        "badge": "24 regions | 42 cities"
      },
      {
        "id": "BOL",
        "name": "Bolivia",
        "flag": "🇧🇴",
        "center": [
          -65,
          -17
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "BRA",
        "name": "Brazil",
        "flag": "🇧🇷",
        "center": [
          -55,
          -10
        ],
        "zoom": 4.5,
        "badge": "27 regions | 349 cities"
      },
      {
        "id": "CHL",
        "name": "Chile",
        "flag": "🇨🇱",
        "center": [
          -71,
          -30
        ],
        "zoom": 4.5,
        "badge": "39 cities"
      },
      {
        "id": "COL",
        "name": "Colombia",
        "flag": "🇨🇴",
        "center": [
          -72,
          4
        ],
        "zoom": 4.5,
        "badge": "33 regions | 70 cities"
      },
      {
        "id": "ECU",
        "name": "Ecuador",
        "flag": "🇪🇨",
        "center": [
          -77.5,
          -2
        ],
        "zoom": 4.5,
        "badge": "21 cities"
      },
      {
        "id": "GUY",
        "name": "Guyana",
        "flag": "🇬🇾",
        "center": [
          -59,
          5
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "FLK",
        "name": "Falkland Islands",
        "flag": "🇫🇰",
        "center": [
          -59,
          -51.75
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "PRY",
        "name": "Paraguay",
        "flag": "🇵🇾",
        "center": [
          -58,
          -23
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "PER",
        "name": "Peru",
        "flag": "🇵🇪",
        "center": [
          -76,
          -10
        ],
        "zoom": 4.5,
        "badge": "29 cities"
      },
      {
        "id": "SUR",
        "name": "Suriname",
        "flag": "🇸🇷",
        "center": [
          -56,
          4
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "URY",
        "name": "Uruguay",
        "flag": "🇺🇾",
        "center": [
          -56,
          -33
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "VEN",
        "name": "Venezuela",
        "flag": "🇻🇪",
        "center": [
          -66,
          8
        ],
        "zoom": 4.5,
        "badge": "47 cities"
      }
    ]
  },
  {
    "id": "north_america",
    "label": "N. America",
    "icon": "🌎",
    "items": [
      {
        "id": "NORTH_AMERICA",
        "name": "North America",
        "flag": "🌎",
        "center": [
          -98.57,
          39.82
        ],
        "zoom": 3.2,
        "badge": "39 países"
      },
      {
        "id": "AIA",
        "name": "Anguilla",
        "flag": "🇦🇮",
        "center": [
          -63.17,
          18.25
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "ATG",
        "name": "Antigua and Barbuda",
        "flag": "🇦🇬",
        "center": [
          -61.8,
          17.05
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "ABW",
        "name": "Aruba",
        "flag": "🇦🇼",
        "center": [
          -69.97,
          12.5
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "BHS",
        "name": "Bahamas",
        "flag": "🇧🇸",
        "center": [
          -76,
          24.25
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "BRB",
        "name": "Barbados",
        "flag": "🇧🇧",
        "center": [
          -59.53,
          13.17
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "BLZ",
        "name": "Belize",
        "flag": "🇧🇿",
        "center": [
          -88.75,
          17.25
        ],
        "zoom": 4.5,
        "badge": "5 cities"
      },
      {
        "id": "BMU",
        "name": "Bermuda",
        "flag": "🇧🇲",
        "center": [
          -64.75,
          32.33
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "CAN",
        "name": "Canada",
        "flag": "🇨🇦",
        "center": [
          -95,
          60
        ],
        "zoom": 4.5,
        "badge": "13 regions | 105 cities"
      },
      {
        "id": "CRI",
        "name": "Costa Rica",
        "flag": "🇨🇷",
        "center": [
          -84,
          10
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "CUB",
        "name": "Cuba",
        "flag": "🇨🇺",
        "center": [
          -80,
          21.5
        ],
        "zoom": 4.5,
        "badge": "22 cities"
      },
      {
        "id": "DMA",
        "name": "Dominica",
        "flag": "🇩🇲",
        "center": [
          -61.33,
          15.42
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "SLV",
        "name": "El Salvador",
        "flag": "🇸🇻",
        "center": [
          -88.92,
          13.83
        ],
        "zoom": 4.5,
        "badge": "5 cities"
      },
      {
        "id": "USA",
        "name": "United States",
        "flag": "🇺🇸",
        "center": [
          -97,
          38
        ],
        "zoom": 4.5,
        "badge": "51 regions | 643 cities"
      },
      {
        "id": "GRD",
        "name": "Grenada",
        "flag": "🇬🇩",
        "center": [
          -61.67,
          12.12
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "GRL",
        "name": "Greenland",
        "flag": "🇬🇱",
        "center": [
          -40,
          72
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "GTM",
        "name": "Guatemala",
        "flag": "🇬🇹",
        "center": [
          -90.25,
          15.5
        ],
        "zoom": 4.5,
        "badge": "17 cities"
      },
      {
        "id": "HTI",
        "name": "Haiti",
        "flag": "🇭🇹",
        "center": [
          -72.42,
          19
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "HND",
        "name": "Honduras",
        "flag": "🇭🇳",
        "center": [
          -86.5,
          15
        ],
        "zoom": 4.5,
        "badge": "12 cities"
      },
      {
        "id": "CYM",
        "name": "Cayman Islands",
        "flag": "🇰🇾",
        "center": [
          -80.5,
          19.5
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "UMI",
        "name": "United States Minor Outlying Islands",
        "flag": "🇺🇲",
        "center": [
          166.63,
          19.3
        ],
        "zoom": 4.5
      },
      {
        "id": "TCA",
        "name": "Turks and Caicos Islands",
        "flag": "🇹🇨",
        "center": [
          -71.58,
          21.75
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "VGB",
        "name": "British Virgin Islands",
        "flag": "🇻🇬",
        "center": [
          -64.62,
          18.43
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "VIR",
        "name": "United States Virgin Islands",
        "flag": "🇻🇮",
        "center": [
          -64.93,
          18.35
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "JAM",
        "name": "Jamaica",
        "flag": "🇯🇲",
        "center": [
          -77.5,
          18.25
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "MSR",
        "name": "Montserrat",
        "flag": "🇲🇸",
        "center": [
          -62.2,
          16.75
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "MEX",
        "name": "Mexico",
        "flag": "🇲🇽",
        "center": [
          -102,
          23
        ],
        "zoom": 4.5,
        "badge": "33 regions | 121 cities"
      },
      {
        "id": "NIC",
        "name": "Nicaragua",
        "flag": "🇳🇮",
        "center": [
          -85,
          13
        ],
        "zoom": 4.5,
        "badge": "11 cities"
      },
      {
        "id": "PAN",
        "name": "Panama",
        "flag": "🇵🇦",
        "center": [
          -80,
          9
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "PRI",
        "name": "Puerto Rico",
        "flag": "🇵🇷",
        "center": [
          -66.5,
          18.25
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "DOM",
        "name": "Dominican Republic",
        "flag": "🇩🇴",
        "center": [
          -70.67,
          19
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "SPM",
        "name": "Saint Pierre and Miquelon",
        "flag": "🇵🇲",
        "center": [
          -56.33,
          46.83
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "LCA",
        "name": "Saint Lucia",
        "flag": "🇱🇨",
        "center": [
          -60.97,
          13.88
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "BLM",
        "name": "Saint Barthélemy",
        "flag": "🇧🇱",
        "center": [
          -63.42,
          18.5
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "KNA",
        "name": "Saint Kitts and Nevis",
        "flag": "🇰🇳",
        "center": [
          -62.75,
          17.33
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "MAF",
        "name": "Saint Martin",
        "flag": "🇲🇫",
        "center": [
          -63.95,
          18.08
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "SXM",
        "name": "Sint Maarten",
        "flag": "🇸🇽",
        "center": [
          -63.05,
          18.03
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "VCT",
        "name": "Saint Vincent and the Grenadines",
        "flag": "🇻🇨",
        "center": [
          -61.2,
          13.25
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "TTO",
        "name": "Trinidad and Tobago",
        "flag": "🇹🇹",
        "center": [
          -61,
          11
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "CUW",
        "name": "Curaçao",
        "flag": "🇨🇼",
        "center": [
          -68.93,
          12.12
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      }
    ]
  },
  {
    "id": "europe",
    "label": "Europe",
    "icon": "🇪🇺",
    "items": [
      {
        "id": "EUR",
        "name": "Europe",
        "flag": "🇪🇺",
        "center": [
          10.0,
          50.0
        ],
        "zoom": 3.8,
        "badge": "53 países"
      },
      {
        "id": "ALB",
        "name": "Albania",
        "flag": "🇦🇱",
        "center": [
          20,
          41
        ],
        "zoom": 4.5,
        "badge": "12 cities"
      },
      {
        "id": "DEU",
        "name": "Germany",
        "flag": "🇩🇪",
        "center": [
          9,
          51
        ],
        "zoom": 4.5,
        "badge": "16 regions | 102 cities"
      },
      {
        "id": "ALA",
        "name": "Åland Islands",
        "flag": "🇦🇽",
        "center": [
          19.9,
          60.12
        ],
        "zoom": 4.5
      },
      {
        "id": "AND",
        "name": "Andorra",
        "flag": "🇦🇩",
        "center": [
          1.5,
          42.5
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "BLR",
        "name": "Belarus",
        "flag": "🇧🇾",
        "center": [
          28,
          53
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "BGR",
        "name": "Bulgaria",
        "flag": "🇧🇬",
        "center": [
          25,
          43
        ],
        "zoom": 4.5,
        "badge": "21 cities"
      },
      {
        "id": "BEL",
        "name": "Belgium",
        "flag": "🇧🇪",
        "center": [
          4,
          50.83
        ],
        "zoom": 4.5,
        "badge": "18 cities"
      },
      {
        "id": "BIH",
        "name": "Bosnia and Herzegovina",
        "flag": "🇧🇦",
        "center": [
          18,
          44
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "CYP",
        "name": "Cyprus",
        "flag": "🇨🇾",
        "center": [
          33,
          35
        ],
        "zoom": 4.5,
        "badge": "5 cities"
      },
      {
        "id": "NCY",
        "name": "Chipre do Norte",
        "flag": "🇨🇾",
        "center": [
          0,
          0
        ],
        "zoom": 4.5
      },
      {
        "id": "CZE",
        "name": "Czechia",
        "flag": "🇨🇿",
        "center": [
          15.5,
          49.75
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "VAT",
        "name": "Vatican City",
        "flag": "🇻🇦",
        "center": [
          12.45,
          41.9
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "HRV",
        "name": "Croatia",
        "flag": "🇭🇷",
        "center": [
          15.5,
          45.17
        ],
        "zoom": 4.5,
        "badge": "25 cities"
      },
      {
        "id": "DNK",
        "name": "Denmark",
        "flag": "🇩🇰",
        "center": [
          10,
          56
        ],
        "zoom": 4.5,
        "badge": "17 cities"
      },
      {
        "id": "SVK",
        "name": "Slovakia",
        "flag": "🇸🇰",
        "center": [
          19.5,
          48.67
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "SVN",
        "name": "Slovenia",
        "flag": "🇸🇮",
        "center": [
          14.82,
          46.12
        ],
        "zoom": 4.5,
        "badge": "6 cities"
      },
      {
        "id": "ESP",
        "name": "Spain",
        "flag": "🇪🇸",
        "center": [
          -4,
          40
        ],
        "zoom": 4.5,
        "badge": "19 regions | 91 cities"
      },
      {
        "id": "EST",
        "name": "Estonia",
        "flag": "🇪🇪",
        "center": [
          26,
          59
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "FIN",
        "name": "Finland",
        "flag": "🇫🇮",
        "center": [
          26,
          64
        ],
        "zoom": 4.5,
        "badge": "23 cities"
      },
      {
        "id": "FRA",
        "name": "France",
        "flag": "🇫🇷",
        "center": [
          2,
          46
        ],
        "zoom": 4.5,
        "badge": "18 regions | 105 cities"
      },
      {
        "id": "GIB",
        "name": "Gibraltar",
        "flag": "🇬🇮",
        "center": [
          -5.35,
          36.13
        ],
        "zoom": 4.5
      },
      {
        "id": "GRC",
        "name": "Greece",
        "flag": "🇬🇷",
        "center": [
          22,
          39
        ],
        "zoom": 4.5,
        "badge": "41 cities"
      },
      {
        "id": "GGY",
        "name": "Guernsey",
        "flag": "🇬🇬",
        "center": [
          -2.58,
          49.47
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "NLD",
        "name": "Netherlands",
        "flag": "🇳🇱",
        "center": [
          5.75,
          52.5
        ],
        "zoom": 4.5,
        "badge": "21 cities"
      },
      {
        "id": "HUN",
        "name": "Hungary",
        "flag": "🇭🇺",
        "center": [
          20,
          47
        ],
        "zoom": 4.5,
        "badge": "15 cities"
      },
      {
        "id": "IMN",
        "name": "Isle of Man",
        "flag": "🇮🇲",
        "center": [
          -4.5,
          54.25
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "FRO",
        "name": "Faroe Islands",
        "flag": "🇫🇴",
        "center": [
          -7,
          62
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "IRL",
        "name": "Ireland",
        "flag": "🇮🇪",
        "center": [
          -8,
          53
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "ISL",
        "name": "Iceland",
        "flag": "🇮🇸",
        "center": [
          -18,
          65
        ],
        "zoom": 4.5,
        "badge": "15 cities"
      },
      {
        "id": "ITA",
        "name": "Italy",
        "flag": "🇮🇹",
        "center": [
          12.83,
          42.83
        ],
        "zoom": 4.5,
        "badge": "20 regions | 91 cities"
      },
      {
        "id": "JEY",
        "name": "Jersey",
        "flag": "🇯🇪",
        "center": [
          -2.17,
          49.25
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "XKX",
        "name": "Kosovo",
        "flag": "🇽🇰",
        "center": [
          0,
          0
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "LVA",
        "name": "Latvia",
        "flag": "🇱🇻",
        "center": [
          25,
          57
        ],
        "zoom": 4.5,
        "badge": "6 cities"
      },
      {
        "id": "LIE",
        "name": "Liechtenstein",
        "flag": "🇱🇮",
        "center": [
          9.53,
          47.27
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "LTU",
        "name": "Lithuania",
        "flag": "🇱🇹",
        "center": [
          24,
          56
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "LUX",
        "name": "Luxembourg",
        "flag": "🇱🇺",
        "center": [
          6.17,
          49.75
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "MKD",
        "name": "North Macedonia",
        "flag": "🇲🇰",
        "center": [
          22,
          41.83
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "MLT",
        "name": "Malta",
        "flag": "🇲🇹",
        "center": [
          14.58,
          35.83
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "MDA",
        "name": "Moldova",
        "flag": "🇲🇩",
        "center": [
          29,
          47
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "MNE",
        "name": "Montenegro",
        "flag": "🇲🇪",
        "center": [
          19.3,
          42.5
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "MCO",
        "name": "Monaco",
        "flag": "🇲🇨",
        "center": [
          7.4,
          43.73
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "NOR",
        "name": "Norway",
        "flag": "🇳🇴",
        "center": [
          10,
          62
        ],
        "zoom": 4.5,
        "badge": "28 cities"
      },
      {
        "id": "POL",
        "name": "Poland",
        "flag": "🇵🇱",
        "center": [
          20,
          52
        ],
        "zoom": 4.5,
        "badge": "16 regions | 44 cities"
      },
      {
        "id": "PRT",
        "name": "Portugal",
        "flag": "🇵🇹",
        "center": [
          -8,
          39.5
        ],
        "zoom": 4.5,
        "badge": "37 cities"
      },
      {
        "id": "GBR",
        "name": "United Kingdom",
        "flag": "🇬🇧",
        "center": [
          -2,
          54
        ],
        "zoom": 4.5,
        "badge": "4 regions | 131 cities"
      },
      {
        "id": "ROU",
        "name": "Romania",
        "flag": "🇷🇴",
        "center": [
          25,
          46
        ],
        "zoom": 4.5,
        "badge": "27 cities"
      },
      {
        "id": "RUS",
        "name": "Russia",
        "flag": "🇷🇺",
        "center": [
          100,
          60
        ],
        "zoom": 4.5,
        "badge": "196 cities"
      },
      {
        "id": "SMR",
        "name": "San Marino",
        "flag": "🇸🇲",
        "center": [
          12.42,
          43.77
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "SWE",
        "name": "Sweden",
        "flag": "🇸🇪",
        "center": [
          15,
          62
        ],
        "zoom": 4.5,
        "badge": "26 cities"
      },
      {
        "id": "CHE",
        "name": "Switzerland",
        "flag": "🇨🇭",
        "center": [
          8,
          47
        ],
        "zoom": 4.5,
        "badge": "24 cities"
      },
      {
        "id": "SRB",
        "name": "Serbia",
        "flag": "🇷🇸",
        "center": [
          21,
          44
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "UKR",
        "name": "Ukraine",
        "flag": "🇺🇦",
        "center": [
          32,
          49
        ],
        "zoom": 4.5,
        "badge": "58 cities"
      },
      {
        "id": "AUT",
        "name": "Austria",
        "flag": "🇦🇹",
        "center": [
          13.33,
          47.33
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      }
    ]
  },
  {
    "id": "asia",
    "label": "Asia",
    "icon": "🌏",
    "items": [
      {
        "id": "ASIA",
        "name": "Asia",
        "flag": "🌏",
        "center": [
          100.0,
          35.0
        ],
        "zoom": 3.0,
        "badge": "50 países"
      },
      {
        "id": "AFG",
        "name": "Afghanistan",
        "flag": "🇦🇫",
        "center": [
          65,
          33
        ],
        "zoom": 4.5,
        "badge": "32 cities"
      },
      {
        "id": "ARM",
        "name": "Armenia",
        "flag": "🇦🇲",
        "center": [
          45,
          40
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "SAU",
        "name": "Saudi Arabia",
        "flag": "🇸🇦",
        "center": [
          45,
          25
        ],
        "zoom": 4.5,
        "badge": "23 cities"
      },
      {
        "id": "AZE",
        "name": "Azerbaijan",
        "flag": "🇦🇿",
        "center": [
          47.5,
          40.5
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "BHR",
        "name": "Bahrain",
        "flag": "🇧🇭",
        "center": [
          50.55,
          26
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "BGD",
        "name": "Bangladesh",
        "flag": "🇧🇩",
        "center": [
          90,
          24
        ],
        "zoom": 4.5,
        "badge": "20 cities"
      },
      {
        "id": "BRN",
        "name": "Brunei",
        "flag": "🇧🇳",
        "center": [
          114.67,
          4.5
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "BTN",
        "name": "Bhutan",
        "flag": "🇧🇹",
        "center": [
          90.5,
          27.5
        ],
        "zoom": 4.5,
        "badge": "6 cities"
      },
      {
        "id": "KHM",
        "name": "Cambodia",
        "flag": "🇰🇭",
        "center": [
          105,
          13
        ],
        "zoom": 4.5,
        "badge": "11 cities"
      },
      {
        "id": "QAT",
        "name": "Qatar",
        "flag": "🇶🇦",
        "center": [
          51.25,
          25.5
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "KAZ",
        "name": "Kazakhstan",
        "flag": "🇰🇿",
        "center": [
          68,
          48
        ],
        "zoom": 4.5,
        "badge": "25 cities"
      },
      {
        "id": "CHN",
        "name": "China",
        "flag": "🇨🇳",
        "center": [
          105,
          35
        ],
        "zoom": 4.5,
        "badge": "32 regions | 732 cities"
      },
      {
        "id": "PRK",
        "name": "North Korea",
        "flag": "🇰🇵",
        "center": [
          127,
          40
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "KOR",
        "name": "South Korea",
        "flag": "🇰🇷",
        "center": [
          127.5,
          37
        ],
        "zoom": 4.5,
        "badge": "28 cities"
      },
      {
        "id": "ARE",
        "name": "United Arab Emirates",
        "flag": "🇦🇪",
        "center": [
          54,
          24
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "PHL",
        "name": "Philippines",
        "flag": "🇵🇭",
        "center": [
          122,
          13
        ],
        "zoom": 4.5,
        "badge": "74 cities"
      },
      {
        "id": "GEO",
        "name": "Georgia",
        "flag": "🇬🇪",
        "center": [
          43.5,
          42
        ],
        "zoom": 4.5,
        "badge": "11 cities"
      },
      {
        "id": "HKG",
        "name": "Hong Kong",
        "flag": "🇭🇰",
        "center": [
          114.19,
          22.27
        ],
        "zoom": 4.5
      },
      {
        "id": "TWN",
        "name": "Taiwan",
        "flag": "🇹🇼",
        "center": [
          121,
          23.5
        ],
        "zoom": 4.5,
        "badge": "18 cities"
      },
      {
        "id": "IDN",
        "name": "Indonesia",
        "flag": "🇮🇩",
        "center": [
          120,
          -5
        ],
        "zoom": 4.5,
        "badge": "33 regions | 100 cities"
      },
      {
        "id": "IRQ",
        "name": "Iraq",
        "flag": "🇮🇶",
        "center": [
          44,
          33
        ],
        "zoom": 4.5,
        "badge": "29 cities"
      },
      {
        "id": "IRN",
        "name": "Iran",
        "flag": "🇮🇷",
        "center": [
          53,
          32
        ],
        "zoom": 4.5,
        "badge": "83 cities"
      },
      {
        "id": "ISR",
        "name": "Israel",
        "flag": "🇮🇱",
        "center": [
          35.13,
          31.47
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "YEM",
        "name": "Yemen",
        "flag": "🇾🇪",
        "center": [
          48,
          15
        ],
        "zoom": 4.5,
        "badge": "12 cities"
      },
      {
        "id": "JPN",
        "name": "Japan",
        "flag": "🇯🇵",
        "center": [
          138,
          36
        ],
        "zoom": 4.5,
        "badge": "47 regions | 216 cities"
      },
      {
        "id": "JOR",
        "name": "Jordan",
        "flag": "🇯🇴",
        "center": [
          36,
          31
        ],
        "zoom": 4.5,
        "badge": "15 cities"
      },
      {
        "id": "KWT",
        "name": "Kuwait",
        "flag": "🇰🇼",
        "center": [
          45.75,
          29.5
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "LAO",
        "name": "Laos",
        "flag": "🇱🇦",
        "center": [
          105,
          18
        ],
        "zoom": 4.5,
        "badge": "6 cities"
      },
      {
        "id": "LBN",
        "name": "Lebanon",
        "flag": "🇱🇧",
        "center": [
          35.83,
          33.83
        ],
        "zoom": 4.5,
        "badge": "12 cities"
      },
      {
        "id": "MAC",
        "name": "Macau",
        "flag": "🇲🇴",
        "center": [
          113.55,
          22.17
        ],
        "zoom": 4.5
      },
      {
        "id": "MDV",
        "name": "Maldives",
        "flag": "🇲🇻",
        "center": [
          73,
          3.25
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "MYS",
        "name": "Malaysia",
        "flag": "🇲🇾",
        "center": [
          112.5,
          2.5
        ],
        "zoom": 4.5,
        "badge": "33 cities"
      },
      {
        "id": "MNG",
        "name": "Mongolia",
        "flag": "🇲🇳",
        "center": [
          105,
          46
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "MMR",
        "name": "Myanmar",
        "flag": "🇲🇲",
        "center": [
          98,
          22
        ],
        "zoom": 4.5,
        "badge": "24 cities"
      },
      {
        "id": "NPL",
        "name": "Nepal",
        "flag": "🇳🇵",
        "center": [
          84,
          28
        ],
        "zoom": 4.5,
        "badge": "19 cities"
      },
      {
        "id": "OMN",
        "name": "Oman",
        "flag": "🇴🇲",
        "center": [
          57,
          21
        ],
        "zoom": 4.5,
        "badge": "11 cities"
      },
      {
        "id": "PSE",
        "name": "Palestine",
        "flag": "🇵🇸",
        "center": [
          35.2,
          31.9
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "PAK",
        "name": "Pakistan",
        "flag": "🇵🇰",
        "center": [
          70,
          30
        ],
        "zoom": 4.5,
        "badge": "70 cities"
      },
      {
        "id": "KGZ",
        "name": "Kyrgyzstan",
        "flag": "🇰🇬",
        "center": [
          75,
          41
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "SGP",
        "name": "Singapore",
        "flag": "🇸🇬",
        "center": [
          103.8,
          1.37
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "LKA",
        "name": "Sri Lanka",
        "flag": "🇱🇰",
        "center": [
          81,
          7
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "SYR",
        "name": "Syria",
        "flag": "🇸🇾",
        "center": [
          38,
          35
        ],
        "zoom": 4.5,
        "badge": "31 cities"
      },
      {
        "id": "THA",
        "name": "Thailand",
        "flag": "🇹🇭",
        "center": [
          100,
          15
        ],
        "zoom": 4.5,
        "badge": "37 cities"
      },
      {
        "id": "TJK",
        "name": "Tajikistan",
        "flag": "🇹🇯",
        "center": [
          71,
          39
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "TLS",
        "name": "Timor-Leste",
        "flag": "🇹🇱",
        "center": [
          125.92,
          -8.83
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "TKM",
        "name": "Turkmenistan",
        "flag": "🇹🇲",
        "center": [
          60,
          40
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "TUR",
        "name": "Türkiye",
        "flag": "🇹🇷",
        "center": [
          35,
          39
        ],
        "zoom": 4.5,
        "badge": "108 cities"
      },
      {
        "id": "UZB",
        "name": "Uzbekistan",
        "flag": "🇺🇿",
        "center": [
          64,
          41
        ],
        "zoom": 4.5,
        "badge": "19 cities"
      },
      {
        "id": "VNM",
        "name": "Vietnam",
        "flag": "🇻🇳",
        "center": [
          107.83,
          16.17
        ],
        "zoom": 4.5,
        "badge": "60 cities"
      },
      {
        "id": "IND",
        "name": "India",
        "flag": "🇮🇳",
        "center": [
          77,
          20
        ],
        "zoom": 4.5,
        "badge": "36 regions | 519 cities"
      }
    ]
  },
  {
    "id": "africa",
    "label": "Africa",
    "icon": "🌍",
    "items": [
      {
        "id": "AFRICA",
        "name": "Africa",
        "flag": "🌍",
        "center": [
          20.0,
          5.0
        ],
        "zoom": 3.0,
        "badge": "58 países"
      },
      {
        "id": "AGO",
        "name": "Angola",
        "flag": "🇦🇴",
        "center": [
          18.5,
          -12.5
        ],
        "zoom": 4.5,
        "badge": "23 cities"
      },
      {
        "id": "DZA",
        "name": "Algeria",
        "flag": "🇩🇿",
        "center": [
          3,
          28
        ],
        "zoom": 4.5,
        "badge": "51 cities"
      },
      {
        "id": "BEN",
        "name": "Benin",
        "flag": "🇧🇯",
        "center": [
          2.25,
          9.5
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "BWA",
        "name": "Botswana",
        "flag": "🇧🇼",
        "center": [
          24,
          -22
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "BFA",
        "name": "Burkina Faso",
        "flag": "🇧🇫",
        "center": [
          -2,
          13
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "BDI",
        "name": "Burundi",
        "flag": "🇧🇮",
        "center": [
          30,
          -3.5
        ],
        "zoom": 4.5,
        "badge": "5 cities"
      },
      {
        "id": "CPV",
        "name": "Cape Verde",
        "flag": "🇨🇻",
        "center": [
          -24,
          16
        ],
        "zoom": 4.5,
        "badge": "6 cities"
      },
      {
        "id": "CMR",
        "name": "Cameroon",
        "flag": "🇨🇲",
        "center": [
          12,
          6
        ],
        "zoom": 4.5,
        "badge": "15 cities"
      },
      {
        "id": "TCD",
        "name": "Chad",
        "flag": "🇹🇩",
        "center": [
          19,
          15
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "COM",
        "name": "Comoros",
        "flag": "🇰🇲",
        "center": [
          44.25,
          -12.17
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "COG",
        "name": "Congo",
        "flag": "🇨🇬",
        "center": [
          15,
          -1
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "CIV",
        "name": "Ivory Coast",
        "flag": "🇨🇮",
        "center": [
          -5,
          8
        ],
        "zoom": 4.5,
        "badge": "20 cities"
      },
      {
        "id": "DJI",
        "name": "Djibouti",
        "flag": "🇩🇯",
        "center": [
          43,
          11.5
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "EGY",
        "name": "Egypt",
        "flag": "🇪🇬",
        "center": [
          30,
          27
        ],
        "zoom": 4.5,
        "badge": "71 cities"
      },
      {
        "id": "ERI",
        "name": "Eritrea",
        "flag": "🇪🇷",
        "center": [
          39,
          15
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "SWZ",
        "name": "Eswatini",
        "flag": "🇸🇿",
        "center": [
          31.5,
          -26.5
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "ETH",
        "name": "Ethiopia",
        "flag": "🇪🇹",
        "center": [
          38,
          8
        ],
        "zoom": 4.5,
        "badge": "22 cities"
      },
      {
        "id": "GAB",
        "name": "Gabon",
        "flag": "🇬🇦",
        "center": [
          11.75,
          -1
        ],
        "zoom": 4.5,
        "badge": "9 cities"
      },
      {
        "id": "GHA",
        "name": "Ghana",
        "flag": "🇬🇭",
        "center": [
          -2,
          8
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "GIN",
        "name": "Guinea",
        "flag": "🇬🇳",
        "center": [
          -10,
          11
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "GNQ",
        "name": "Equatorial Guinea",
        "flag": "🇬🇶",
        "center": [
          10,
          2
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "GNB",
        "name": "Guinea-Bissau",
        "flag": "🇬🇼",
        "center": [
          -15,
          12
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "GMB",
        "name": "Gambia",
        "flag": "🇬🇲",
        "center": [
          -16.57,
          13.47
        ],
        "zoom": 4.5,
        "badge": "5 cities"
      },
      {
        "id": "LSO",
        "name": "Lesotho",
        "flag": "🇱🇸",
        "center": [
          28.5,
          -29.5
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "LBR",
        "name": "Liberia",
        "flag": "🇱🇷",
        "center": [
          -9.5,
          6.5
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "LBY",
        "name": "Libya",
        "flag": "🇱🇾",
        "center": [
          17,
          25
        ],
        "zoom": 4.5,
        "badge": "13 cities"
      },
      {
        "id": "MDG",
        "name": "Madagascar",
        "flag": "🇲🇬",
        "center": [
          47,
          -20
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "MWI",
        "name": "Malawi",
        "flag": "🇲🇼",
        "center": [
          34,
          -13.5
        ],
        "zoom": 4.5,
        "badge": "5 cities"
      },
      {
        "id": "MLI",
        "name": "Mali",
        "flag": "🇲🇱",
        "center": [
          -4,
          17
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "MAR",
        "name": "Morocco",
        "flag": "🇲🇦",
        "center": [
          -5,
          32
        ],
        "zoom": 4.5,
        "badge": "42 cities"
      },
      {
        "id": "MRT",
        "name": "Mauritania",
        "flag": "🇲🇷",
        "center": [
          -12,
          20
        ],
        "zoom": 4.5,
        "badge": "18 cities"
      },
      {
        "id": "MUS",
        "name": "Mauritius",
        "flag": "🇲🇺",
        "center": [
          57.55,
          -20.28
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "MOZ",
        "name": "Mozambique",
        "flag": "🇲🇿",
        "center": [
          35,
          -18.25
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "NAM",
        "name": "Namibia",
        "flag": "🇳🇦",
        "center": [
          17,
          -22
        ],
        "zoom": 4.5,
        "badge": "12 cities"
      },
      {
        "id": "NGA",
        "name": "Nigeria",
        "flag": "🇳🇬",
        "center": [
          8,
          10
        ],
        "zoom": 4.5,
        "badge": "62 cities"
      },
      {
        "id": "NER",
        "name": "Niger",
        "flag": "🇳🇪",
        "center": [
          8,
          16
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "KEN",
        "name": "Kenya",
        "flag": "🇰🇪",
        "center": [
          38,
          1
        ],
        "zoom": 4.5,
        "badge": "24 cities"
      },
      {
        "id": "CAF",
        "name": "Central African Republic",
        "flag": "🇨🇫",
        "center": [
          21,
          7
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "COD",
        "name": "DR Congo",
        "flag": "🇨🇩",
        "center": [
          25,
          0
        ],
        "zoom": 4.5,
        "badge": "28 cities"
      },
      {
        "id": "RWA",
        "name": "Rwanda",
        "flag": "🇷🇼",
        "center": [
          30,
          -2
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "ESH",
        "name": "Western Sahara",
        "flag": "🇪🇭",
        "center": [
          -13,
          24.5
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "SHN",
        "name": "Saint Helena, Ascension and Tristan da Cunha",
        "flag": "🇸🇭",
        "center": [
          -5.72,
          -15.95
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "SYC",
        "name": "Seychelles",
        "flag": "🇸🇨",
        "center": [
          55.67,
          -4.58
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "SEN",
        "name": "Senegal",
        "flag": "🇸🇳",
        "center": [
          -14,
          14
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "SLE",
        "name": "Sierra Leone",
        "flag": "🇸🇱",
        "center": [
          -11.5,
          8.5
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "SML",
        "name": "Somalilândia",
        "flag": "🇸🇴",
        "center": [
          0,
          0
        ],
        "zoom": 4.5
      },
      {
        "id": "SOM",
        "name": "Somalia",
        "flag": "🇸🇴",
        "center": [
          49,
          10
        ],
        "zoom": 4.5,
        "badge": "14 cities"
      },
      {
        "id": "SDN",
        "name": "Sudan",
        "flag": "🇸🇩",
        "center": [
          30,
          15
        ],
        "zoom": 4.5,
        "badge": "20 cities"
      },
      {
        "id": "SSD",
        "name": "South Sudan",
        "flag": "🇸🇸",
        "center": [
          30,
          7
        ],
        "zoom": 4.5,
        "badge": "6 cities"
      },
      {
        "id": "STP",
        "name": "São Tomé and Príncipe",
        "flag": "🇸🇹",
        "center": [
          7,
          1
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "TZA",
        "name": "Tanzania",
        "flag": "🇹🇿",
        "center": [
          35,
          -6
        ],
        "zoom": 4.5,
        "badge": "31 cities"
      },
      {
        "id": "IOT",
        "name": "British Indian Ocean Territory",
        "flag": "🇮🇴",
        "center": [
          71.5,
          -6
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "TGO",
        "name": "Togo",
        "flag": "🇹🇬",
        "center": [
          1.17,
          8
        ],
        "zoom": 4.5,
        "badge": "10 cities"
      },
      {
        "id": "TUN",
        "name": "Tunisia",
        "flag": "🇹🇳",
        "center": [
          9,
          34
        ],
        "zoom": 4.5,
        "badge": "18 cities"
      },
      {
        "id": "UGA",
        "name": "Uganda",
        "flag": "🇺🇬",
        "center": [
          32,
          1
        ],
        "zoom": 4.5,
        "badge": "15 cities"
      },
      {
        "id": "ZWE",
        "name": "Zimbabwe",
        "flag": "🇿🇼",
        "center": [
          30,
          -20
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "ZMB",
        "name": "Zambia",
        "flag": "🇿🇲",
        "center": [
          30,
          -15
        ],
        "zoom": 4.5,
        "badge": "16 cities"
      },
      {
        "id": "ZAF",
        "name": "South Africa",
        "flag": "🇿🇦",
        "center": [
          24,
          -29
        ],
        "zoom": 4.5,
        "badge": "9 regions | 46 cities"
      }
    ]
  },
  {
    "id": "oceania",
    "label": "Oceania",
    "icon": "🏝️",
    "items": [
      {
        "id": "OCEANIA",
        "name": "Oceania",
        "flag": "🏝️",
        "center": [
          133.77,
          -25.27
        ],
        "zoom": 3.5,
        "badge": "28 países"
      },
      {
        "id": "ATA",
        "name": "Antarctica",
        "flag": "🇦🇶",
        "center": [
          0,
          -90
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "AUS",
        "name": "Australia",
        "flag": "🇦🇺",
        "center": [
          133,
          -27
        ],
        "zoom": 4.5,
        "badge": "11 regions | 81 cities"
      },
      {
        "id": "FJI",
        "name": "Fiji",
        "flag": "🇫🇯",
        "center": [
          175,
          -18
        ],
        "zoom": 4.5,
        "badge": "7 cities"
      },
      {
        "id": "GUM",
        "name": "Guam",
        "flag": "🇬🇺",
        "center": [
          144.78,
          13.47
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "HMD",
        "name": "Heard Island and McDonald Islands",
        "flag": "🇭🇲",
        "center": [
          72.52,
          -53.1
        ],
        "zoom": 4.5
      },
      {
        "id": "NFK",
        "name": "Norfolk Island",
        "flag": "🇳🇫",
        "center": [
          167.95,
          -29.03
        ],
        "zoom": 4.5
      },
      {
        "id": "COK",
        "name": "Cook Islands",
        "flag": "🇨🇰",
        "center": [
          -159.77,
          -21.23
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "SGS",
        "name": "South Georgia",
        "flag": "🇬🇸",
        "center": [
          -37,
          -54.5
        ],
        "zoom": 4.5
      },
      {
        "id": "MHL",
        "name": "Marshall Islands",
        "flag": "🇲🇭",
        "center": [
          168,
          9
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "PCN",
        "name": "Pitcairn Islands",
        "flag": "🇵🇳",
        "center": [
          -130.1,
          -25.07
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "SLB",
        "name": "Solomon Islands",
        "flag": "🇸🇧",
        "center": [
          159,
          -8
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "KIR",
        "name": "Kiribati",
        "flag": "🇰🇮",
        "center": [
          173,
          1.42
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "MNP",
        "name": "Northern Mariana Islands",
        "flag": "🇲🇵",
        "center": [
          145.75,
          15.2
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "FSM",
        "name": "Micronesia",
        "flag": "🇫🇲",
        "center": [
          158.25,
          6.92
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "NRU",
        "name": "Nauru",
        "flag": "🇳🇷",
        "center": [
          166.92,
          -0.53
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "NIU",
        "name": "Niue",
        "flag": "🇳🇺",
        "center": [
          -169.87,
          -19.03
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "NCL",
        "name": "New Caledonia",
        "flag": "🇳🇨",
        "center": [
          165.5,
          -21.5
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "NZL",
        "name": "New Zealand",
        "flag": "🇳🇿",
        "center": [
          174,
          -41
        ],
        "zoom": 4.5,
        "badge": "42 cities"
      },
      {
        "id": "PLW",
        "name": "Palau",
        "flag": "🇵🇼",
        "center": [
          134.5,
          7.5
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "PNG",
        "name": "Papua New Guinea",
        "flag": "🇵🇬",
        "center": [
          147,
          -6
        ],
        "zoom": 4.5,
        "badge": "8 cities"
      },
      {
        "id": "PYF",
        "name": "French Polynesia",
        "flag": "🇵🇫",
        "center": [
          -140,
          -15
        ],
        "zoom": 4.5,
        "badge": "4 cities"
      },
      {
        "id": "WSM",
        "name": "Samoa",
        "flag": "🇼🇸",
        "center": [
          -172.33,
          -13.58
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "ASM",
        "name": "American Samoa",
        "flag": "🇦🇸",
        "center": [
          -170,
          -14.33
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "ATF",
        "name": "French Southern and Antarctic Lands",
        "flag": "🇹🇫",
        "center": [
          69.17,
          -49.25
        ],
        "zoom": 4.5
      },
      {
        "id": "TON",
        "name": "Tonga",
        "flag": "🇹🇴",
        "center": [
          -175,
          -20
        ],
        "zoom": 4.5,
        "badge": "2 cities"
      },
      {
        "id": "TUV",
        "name": "Tuvalu",
        "flag": "🇹🇻",
        "center": [
          178,
          -8
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      },
      {
        "id": "VUT",
        "name": "Vanuatu",
        "flag": "🇻🇺",
        "center": [
          167,
          -16
        ],
        "zoom": 4.5,
        "badge": "3 cities"
      },
      {
        "id": "WLF",
        "name": "Wallis and Futuna",
        "flag": "🇼🇫",
        "center": [
          -176.2,
          -13.3
        ],
        "zoom": 4.5,
        "badge": "1 cities"
      }
    ]
  }
];

// Flat map for quick lookup by ISO/ID
export const ALL_REGION_OPTIONS: RegionItem[] = Array.from(
  new Map(
    REGION_TABS.flatMap((tab) => tab.items).map((item) => [item.id, item])
  ).values()
);
