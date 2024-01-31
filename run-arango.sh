#!/bin/bash

nodes=("")

function stop_all_nodes {
    for ((i=${#nodes[@]}-1; i>=0; i--))
    do
        n="${nodes[i]}"
        echo Stop DB on $n
        ssh "$n" 'pkill arango'
    done
}

trap stop_all_nodes EXIT

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/team23w4 

echo Start DB on ${nodes[0]}
ssh "${nodes[0]}" '~/Downloads/arangodb3-linux-3.11.4_x86_64/bin/arangodb --starter.mode cluster --starter.data-dir ~/arango-data/ ' &

for ((i=1; i<${#nodes[@]}; i++))
do
    n="${nodes[i]}"
    echo Start and join DB on $n
    
    ssh "$n" '~/Downloads/arangodb3-linux-3.11.4_x86_64/bin/arangodb --starter.data-dir ~/arango-data/ --starter.join IP_ADDRESS' &
done

wait
