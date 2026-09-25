"""GeoJSON processing, validation, and export utilities with GitHub size limit checks."""

import json
import logging
from pathlib import Path
from typing import Optional
from utils import constants
from utils.schemas import GeoJSONFeatureCollection

logger = logging.getLogger("maptap.processors")


def save_geojson(
    collection: GeoJSONFeatureCollection,
    filename: str,
    export_to_public: bool = True,
    max_size_bytes: Optional[int] = None,
    warn_size_bytes: Optional[int] = None,
) -> Optional[Path]:
    """Serialize, validate size against GitHub limits, and save GeoJSON data.
    
    If payload exceeds GITHUB_MAX_FILE_SIZE_BYTES (100MB), triggers a warning
    and refuses to save to avoid breaking GitHub repository pushes and GitHub Pages.
    """
    max_limit = max_size_bytes or constants.GITHUB_MAX_FILE_SIZE_BYTES
    warn_limit = warn_size_bytes or constants.GITHUB_WARNING_FILE_SIZE_BYTES

    serialized_dict = collection.model_dump(mode="json")
    serialized_bytes = json.dumps(
        serialized_dict,
        ensure_ascii=False,
        indent=2,
    ).encode("utf-8")

    size_bytes = len(serialized_bytes)
    size_mb = size_bytes / (1024 * 1024)

    # Check for hard limit (100MB)
    if size_bytes > max_limit:
        max_mb = max_limit / (1024 * 1024)
        msg = (
            f"[ALERTA CRÍTICO GITHUB] O arquivo '{filename}' possui {size_mb:.2f} MB, "
            f"excedendo o limite máximo do GitHub de {max_mb:.2f} MB. "
            "O arquivo NÃO será salvo em public/ nem enviado para o repositório."
        )
        logger.error(msg)
        print(f"\n⚠️  {msg}\n")
        return None

    # Check for warning threshold (50MB)
    if size_bytes > warn_limit:
        warn_mb = warn_limit / (1024 * 1024)
        msg = (
            f"[AVISO GITHUB] O arquivo '{filename}' possui {size_mb:.2f} MB. "
            f"Arquivos acima de {warn_mb:.2f} MB disparam avisos do GitHub ao commitar."
        )
        logger.warning(msg)
        print(f"⚠️  {msg}")

    constants.PROCESS_DIR.mkdir(parents=True, exist_ok=True)
    process_output = constants.PROCESS_DIR / filename
    with open(process_output, "wb") as f:
        f.write(serialized_bytes)

    if export_to_public:
        constants.FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
        public_output = constants.FRONTEND_PUBLIC_DATA_DIR / filename
        with open(public_output, "wb") as f:
            f.write(serialized_bytes)
        return public_output

    return process_output
