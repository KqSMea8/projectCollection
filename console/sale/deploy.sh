#!/bin/bash

echo '用法： sh ./deploy.sh 0.0.1'
echo '作用： 自动删除原先的tag，重新在当前commit打tag，并推送到默认分支'
echo 'Author @加里，有问题请自己改代码'
echo $1
echo '-----------'
echo
echo

git fetch
git tag -d $1
git push origin :$1
git tag $1
git push origin $1
