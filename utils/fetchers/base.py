"""Base fetcher module for acquiring raw data from remote APIs and datasets."""

import json
from pathlib import Path
from typing import Any, Dict, Optional
import requests
from utils.constants import RAW_DIR


class BaseFetcher:
    """Base class for data fetchers that download raw inputs."""

    def __init__(self, raw_subdir: Optional[str] = None) -> None:
        self.output_dir = RAW_DIR / raw_subdir if raw_subdir else RAW_DIR
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def fetch_json(self, url: str, target_filename: str, timeout: int = 30) -> Dict[str, Any]:
        """Download remote JSON data and save raw copy to data/raw/."""
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
        data: Dict[str, Any] = response.json()

        target_path = self.output_dir / target_filename
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return data
