for j in 0 20 50 100
do
for i in 1 1000 1000000
do
  python ./script.py $i $j | grep ":" > s_results_2/$j\_$i.txt
done
done