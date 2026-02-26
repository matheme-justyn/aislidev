#!/usr/bin/env bash
# 從 config.toml 載入配置

load_config() {
    local cfg="${1:-config.toml}"
    [ ! -f "$cfg" ] && return 1
    
    # 提取數值
    get_val() {
        grep -A 30 '^\[opencode\.cleanup\]' "$cfg" | grep "^$1 " | head -1 | awk -F'=' '{print $2}' | awk '{print $1}'
    }
    
    export OPENCODE_CLEANUP_MAX_SESSIONS=$(get_val "max_sessions")
    export OPENCODE_CLEANUP_MAX_DB_SIZE_MB=$(get_val "max_db_size_mb")
    export OPENCODE_CLEANUP_KEEP_SESSIONS=$(get_val "keep_sessions")
    export OPENCODE_CLEANUP_MIN_DAYS=$(get_val "min_days_before_archive")
    export OPENCODE_CLEANUP_AGGRESSIVE=$(get_val "aggressive_mode")
    export OPENCODE_CLEANUP_AGGRESSIVE_KEEP=$(get_val "aggressive_keep")
    export OPENCODE_CLEANUP_AGGRESSIVE_DAYS=$(get_val "aggressive_min_days")
    
    return 0
}
