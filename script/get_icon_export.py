import os
import sys


# to custom icon load, meed to manual export icons
# this script accept icon type name, then generate export codes
# usage: python get_icon_export.py line-chart
# output:
# export {
#   default as LineChartOutline
# } from '@ant-design/icons/lib/outline/LineChartOutline';
# afterwards, append output export codes into src/icons.js
# ref: https://github.com/HeskeyBaozi/reduce-antd-icons-bundle-demo

def main():
    icon_type_name = sys.argv[1]

    file_name_list = []
    for root, dirs, files in os.walk('../node_modules/@ant-design/icons/lib/outline/'):  # only support outline icons now
        for f in files:
            if f.endswith('.d.ts'):
                file_name_list.append(f[:-5])

    icon_type_name_camel = ''
    goUpper = True
    for c in icon_type_name:
        if c == '-':
            goUpper = True
        elif goUpper:
            icon_type_name_camel += c.upper()
            goUpper = False
        else:
            icon_type_name_camel += c
    icon_type_name_camel += 'Outline'  # only support outline icons now

    if icon_type_name_camel in file_name_list:
        print('''export {
  default as %s
} from '@ant-design/icons/lib/outline/%s';''' % (icon_type_name_camel, icon_type_name_camel))
    else:
        print('cannot find %s' % icon_type_name_camel)

if __name__ == "__main__":
    main()
