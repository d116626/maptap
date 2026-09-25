# MapTap

MapTap is a geographic training and guessing game built with Next.js, MapLibre GL, Tailwind CSS, and GeoNames / Natural Earth geospatial datasets.

## Geospatial Datasets Architecture

The application loads static datasets located in `frontend/public/data/`:

- `countries.geojson`: Sovereign state boundaries worldwide.
- `regions.geojson`: Subnational administrative divisions (states, provinces, departments).
- `cities.json`: Curated global cities and municipalities database with real population data and administrative metadata.

---

## Schema Compacto (`cities.json`)

Para otimização de largura de banda e performance de carregamento no cliente, os atributos do arquivo `frontend/public/data/cities.json` utilizam chaves minificadas, resultando em uma redução de aproximadamente 48,7% no tamanho bruto do JSON.

### Mapeamento de Chaves

| Código Minificado | Nome Original | Tipo | Descrição |
| :---: | :--- | :---: | :--- |
| `id` | `id` | `string` | Identificador único da localização |
| `n` | `name` | `string` | Nome canônico do município |
| `c` | `country` | `string` | Nome do país |
| `cc` | `country_code` | `string` | Código ISO-3 do país (ex.: `BRA`, `USA`, `DEU`) |
| `s` | `state` | `string?` | Nome do estado, província ou departamento (omitido se nulo) |
| `sc` | `state_code` | `string?` | Sigla ou código da divisão subnacional (ex.: `SP`, `CA`) |
| `ct` | `continent` | `string?` | Nome do continente |
| `y` | `lat` | `number` | Latitude geográfica (arredondada a 4 casas) |
| `x` | `lng` | `number` | Longitude geográfica (arredondada a 4 casas) |
| `p` | `population` | `number` | População real do município derivada do GeoNames |
| `is_cc` | `is_country_capital` | `1?` | Presente como `1` apenas para capitais de países |
| `is_sc` | `is_state_capital` | `1?` | Presente como `1` apenas para capitais estaduais/provinciais |
| `is_cap` | `is_capital` | `1?` | Presente como `1` para capitais (país ou estado) |
| `mt` | `is_maptap_base` | `1?` | Presente como `1` se o registro pertencer à base original MapTap (5.894 locais) |

### Exemplo de Registro Minificado

```json
{
  "id": "mt-bra-brasilia",
  "n": "Brasília",
  "c": "Brazil",
  "cc": "BRA",
  "s": "Federal District",
  "sc": "DF",
  "y": -15.7939,
  "x": -47.8828,
  "p": 3015268,
  "is_cc": 1,
  "is_sc": 1,
  "is_cap": 1,
  "ct": "South America",
  "mt": 1
}
```
