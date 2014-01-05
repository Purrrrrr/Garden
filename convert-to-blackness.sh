convert $1 -define histogram:unique-colors=true -format %c histogram:info:- | sed -e 's/ \+\([0-9]\+\): ( *\([0-9]\+\).*/\1 * (255-\2)/' | bc| paste -sd+| bc
